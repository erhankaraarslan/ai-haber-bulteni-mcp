import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { mkdir, writeFile, readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { marked } from "marked";
import juice from "juice";
import { buildEmailHtml } from "./templates/emailTemplate.js";

if (process.env.NODE_ENV !== "production") {
  await import("dotenv/config").catch(() => {});
}

import { fetchFromTavily } from "./services/tavilyService.js";
import { fetchFromRss } from "./services/rssService.js";
import { cacheService } from "./services/cacheService.js";
import { deduplicateNews } from "./utils/dedup.js";
import { PERSONA_CONFIG, TIMEFRAME_LABELS } from "./config/personas.js";
import { RSS_SOURCES, getSourcesForPersona } from "./config/rssSources.js";
import { buildNewsletterPrompt } from "./config/prompts.js";
import type {
  FetchNewsResult,
  Persona,
  Timeframe,
  SearchDepth,
} from "./types/index.js";

// ── MCP Server ────────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "ai-haber-bulteni",
  version: "1.0.0",
});

// ── Ortak Zod Şeması (tool'lar arasında paylaşılır) ──────────────────────────

const newsParamsShape = {
  timeframe: z
    .enum(["daily", "weekly", "monthly"])
    .default("weekly")
    .describe("Haber zaman dilimi: daily (günlük), weekly (haftalık), monthly (aylık)"),
  persona: z
    .enum(["c_level", "product_manager", "developer", "copilot_user"])
    .default("developer")
    .describe("Hedef kitle: c_level (yönetici), product_manager, developer (geliştirici), copilot_user (VS Code + Copilot)"),
  maxItems: z
    .number()
    .min(3)
    .max(20)
    .default(10)
    .describe("Tavily toplam sonuç sayısı / RSS kaynak başına max haber sayısı (3-20)"),
  searchDepth: z
    .enum(["basic", "advanced"])
    .default("basic")
    .describe("Tavily arama derinliği: basic (1 kredi) veya advanced (2 kredi, daha kaliteli)"),
};

// ── Ortak Haber Çekme Fonksiyonu ─────────────────────────────────────────────

async function fetchNewsData(
  persona: Persona,
  timeframe: Timeframe,
  maxItems: number,
  searchDepth: SearchDepth = "basic"
): Promise<FetchNewsResult> {
  const cacheKey = cacheService.buildKey(persona, timeframe);
  const cached = cacheService.get<FetchNewsResult>(cacheKey);

  if (cached) {
    return cached;
  }

  const personaConfig = PERSONA_CONFIG[persona];
  const warnings: string[] = [];

  const [tavilyResult, rssResult] = await Promise.allSettled([
    fetchFromTavily(personaConfig.tavilyQuery, timeframe, maxItems, searchDepth),
    fetchFromRss(persona, timeframe, maxItems),
  ]);

  const tavilyResults =
    tavilyResult.status === "fulfilled" ? tavilyResult.value : [];
  const rssResults =
    rssResult.status === "fulfilled" ? rssResult.value.items : [];

  if (tavilyResult.status === "rejected") {
    const msg = `Tavily API hatası: ${(tavilyResult.reason as Error)?.message}`;
    warnings.push(msg);
    process.stderr.write(`[TAVILY HATA] ${msg}\n`);
  }

  if (rssResult.status === "fulfilled" && rssResult.value.warnings.length > 0) {
    warnings.push(...rssResult.value.warnings);
  } else if (rssResult.status === "rejected") {
    const msg = `RSS hatası: ${(rssResult.reason as Error)?.message}`;
    warnings.push(msg);
    process.stderr.write(`[RSS HATA] ${msg}\n`);
  }

  const result: FetchNewsResult = {
    persona,
    timeframe,
    fetchedAt: new Date().toISOString(),
    tavilyResults,
    rssResults,
    totalCount: tavilyResults.length + rssResults.length,
    warnings,
  };

  cacheService.set(cacheKey, result);
  return result;
}

// ── Tool 1: fetch_ai_news ─────────────────────────────────────────────────────

server.tool(
  "fetch_ai_news",
  "Belirtilen hedef kitle (persona) ve zaman dilimine göre Tavily API ve RSS " +
    "kaynaklarından en güncel yapay zeka haberlerini çeker. Sonuçlar 30 dakika " +
    "boyunca önbelleklenir.",
  newsParamsShape,
  async ({ timeframe, persona, maxItems, searchDepth }) => {
    const result = await fetchNewsData(
      persona as Persona,
      timeframe as Timeframe,
      maxItems,
      searchDepth as SearchDepth
    );

    const warningText =
      result.warnings.length > 0
        ? `\n⚠️ Uyarılar:\n${result.warnings.map((w) => `  - ${w}`).join("\n")}\n`
        : "";

    const allItems = deduplicateNews([
      ...result.tavilyResults,
      ...result.rssResults,
    ]);

    const tableRows = allItems
      .slice(0, 30)
      .map(
        (item, i) =>
          `| ${i + 1} | ${item.title.slice(0, 80)} | ${item.source} | ${item.publishedAt?.slice(0, 10) ?? "—"} | [link](${item.url}) |`
      )
      .join("\n");

    return {
      content: [
        {
          type: "text" as const,
          text:
            `✅ Haberler başarıyla çekildi!\n\n` +
            `📊 Toplam: ${result.totalCount} haber ` +
            `(Tavily: ${result.tavilyResults.length}, RSS: ${result.rssResults.length}) ` +
            `→ Dedup sonrası: ${allItems.length}\n` +
            `🕐 Çekilme zamanı: ${result.fetchedAt}\n` +
            warningText +
            `\n| # | Başlık | Kaynak | Tarih | URL |\n` +
            `|---|--------|--------|-------|-----|\n` +
            tableRows +
            `\n\n💡 Bülten oluşturmak için \`generate_newsletter\`, kaydetmek için \`save_newsletter\` aracını kullanın. Kaydetme hem .md hem .html üretir.`,
        },
      ],
    };
  }
);

// ── Tool 2: generate_newsletter ───────────────────────────────────────────────

server.tool(
  "generate_newsletter",
  "Yapay zeka haberlerini çekip LLM'e iletmek üzere yapılandırılmış Türkçe bülten " +
    "promptu oluşturur. Bu tool'un çıktısını doğrudan bülten olarak kullan.",
  newsParamsShape,
  async ({ timeframe, persona, maxItems, searchDepth }) => {
    const newsData = await fetchNewsData(
      persona as Persona,
      timeframe as Timeframe,
      maxItems,
      searchDepth as SearchDepth
    );

    if (newsData.totalCount === 0) {
      return {
        content: [
          {
            type: "text" as const,
            text:
              "⚠️ Hiç haber çekilemedi. Lütfen şunları kontrol edin:\n" +
              "1. TAVILY_API_KEY ortam değişkeninizin doğruluğunu\n" +
              "2. İnternet bağlantınızı\n" +
              "3. 'get_available_sources' ile RSS kaynaklarının durumunu\n\n" +
              (newsData.warnings.length > 0
                ? `Hata detayları:\n${newsData.warnings.map((w) => `  - ${w}`).join("\n")}`
                : ""),
          },
        ],
      };
    }

    const allItems = deduplicateNews([
      ...newsData.tavilyResults,
      ...newsData.rssResults,
    ]);

    const tavilyUrls = new Set(newsData.tavilyResults.map((i) => i.url));
    const dedupedTavily = allItems.filter((i) => tavilyUrls.has(i.url));
    const dedupedRss = allItems.filter((i) => !tavilyUrls.has(i.url));

    const newsletterPrompt = buildNewsletterPrompt(
      persona as Persona,
      timeframe as Timeframe,
      dedupedTavily,
      dedupedRss
    );

    return {
      content: [
        {
          type: "text" as const,
          text: newsletterPrompt,
        },
        {
          type: "text" as const,
          text:
            "\n\n---\n💾 Bülteni kaydetmek için `save_newsletter` aracını kullan. Hem .md hem Outlook uyumlu .html otomatik oluşturulur.",
        },
      ],
    };
  }
);

// ── Tool 3: get_available_sources ─────────────────────────────────────────────

server.tool(
  "get_available_sources",
  "Sistemde tanımlı tüm RSS haber kaynaklarını persona bazında gruplandırarak listeler.",
  {},
  async () => {
    const grouped = {
      c_level: getSourcesForPersona("c_level").map((s) => `• ${s.name}: ${s.url}`),
      product_manager: getSourcesForPersona("product_manager").map((s) => `• ${s.name}: ${s.url}`),
      developer: getSourcesForPersona("developer").map((s) => `• ${s.name}: ${s.url}`),
      copilot_user: getSourcesForPersona("copilot_user").map((s) => `• ${s.name}: ${s.url}`),
    };

    const total = RSS_SOURCES.length;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `📡 Toplam ${total} RSS kaynağı tanımlı\n\n` +
            `### C-Level (${grouped.c_level.length} kaynak)\n` +
            grouped.c_level.join("\n") +
            `\n\n### Product Manager (${grouped.product_manager.length} kaynak)\n` +
            grouped.product_manager.join("\n") +
            `\n\n### Developer (${grouped.developer.length} kaynak)\n` +
            grouped.developer.join("\n") +
            `\n\n### VS Code + Copilot (${grouped.copilot_user.length} kaynak)\n` +
            grouped.copilot_user.join("\n"),
        },
      ],
    };
  }
);

// ── Tool 4: save_newsletter ───────────────────────────────────────────────────

const PERSONA_LABELS_SHORT: Record<string, string> = {
  c_level: "c-level",
  product_manager: "product-manager",
  developer: "developer",
  copilot_user: "copilot-user",
};

const PERSONA_LABEL_MAP: Record<string, string> = {
  c_level: "C-Level Yöneticiler",
  product_manager: "Ürün Yöneticileri",
  developer: "Yazılım Geliştiriciler",
  copilot_user: "VS Code + Copilot Kullanıcıları",
};

const TIMEFRAME_LABEL_MAP: Record<string, string> = {
  daily: "Günlük",
  weekly: "Haftalık",
  monthly: "Aylık",
};

async function generateHtmlFromMd(
  mdContent: string,
  persona: string,
  timeframe: string,
  date: string,
  brandColor: string,
  logoUrl?: string,
  companyName?: string
): Promise<string> {
  let bodyHtml = await marked.parse(mdContent, { async: false });
  bodyHtml = bodyHtml.replace(/<table>/g, '<table class="data-table">');

  const rawHtml = buildEmailHtml({
    bodyHtml,
    personaLabel: PERSONA_LABEL_MAP[persona] ?? persona,
    timeframeLabel: TIMEFRAME_LABEL_MAP[timeframe] ?? timeframe,
    date,
    brandColor,
    logoUrl,
    companyName,
  });

  return juice(rawHtml);
}

server.tool(
  "save_newsletter",
  "Oluşturulan Türkçe yapay zeka bültenini kaydeder. " +
    "Hem .md hem de Outlook uyumlu .html dosyası otomatik oluşturulur. " +
    "Bülten içeriğini (markdown) content parametresine yapıştır.",
  {
    content: z
      .string()
      .min(50)
      .describe("Kaydedilecek bülten içeriği (markdown formatında)"),
    persona: z
      .enum(["c_level", "product_manager", "developer", "copilot_user"])
      .default("developer")
      .describe("Bültenin hedef kitlesi"),
    timeframe: z
      .enum(["daily", "weekly", "monthly"])
      .default("weekly")
      .describe("Bültenin zaman dilimi"),
    logoUrl: z
      .string()
      .optional()
      .describe("Şirket logosu URL (opsiyonel, HTML şablonunda kullanılır)"),
    brandColor: z
      .string()
      .default("#1a73e8")
      .describe("Marka ana rengi hex (HTML şablonu için, ör: #1a73e8)"),
    companyName: z
      .string()
      .optional()
      .describe("Şirket adı (HTML footer'da görünür)"),
    outputDir: z
      .string()
      .default("newsletters")
      .describe("Çıktı klasörü (varsayılan: newsletters/)"),
  },
  async ({ content, persona, timeframe, logoUrl, brandColor, companyName, outputDir }) => {
    try {
      const dir = resolve(process.cwd(), outputDir);
      await mkdir(dir, { recursive: true });

      const date = new Date().toISOString().slice(0, 10);
      const personaSlug = PERSONA_LABELS_SHORT[persona] ?? persona;
      const mdFilename = `ai-bulten-${personaSlug}-${timeframe}-${date}.md`;
      const mdPath = join(dir, mdFilename);
      await writeFile(mdPath, content, "utf-8");
      process.stderr.write(`[KAYIT] MD: ${mdPath}\n`);

      const htmlFilename = mdFilename.replace(/\.md$/, ".html");
      const htmlPath = join(dir, htmlFilename);
      const inlinedHtml = await generateHtmlFromMd(
        content, persona, timeframe, date, brandColor, logoUrl, companyName
      );
      await writeFile(htmlPath, inlinedHtml, "utf-8");
      process.stderr.write(`[KAYIT] HTML: ${htmlPath}\n`);

      return {
        content: [
          {
            type: "text" as const,
            text:
              `✅ Bülten başarıyla kaydedildi!\n\n` +
              `📄 Markdown: \`${mdPath}\`\n` +
              `📧 HTML E-posta: \`${htmlPath}\`\n` +
              `👤 Persona: ${persona}\n` +
              `📅 Zaman Dilimi: ${timeframe}\n` +
              `📏 MD: ${(content.length / 1024).toFixed(1)} KB | HTML: ${(inlinedHtml.length / 1024).toFixed(1)} KB\n\n` +
              `### Outlook'ta Gönderme:\n` +
              `1. \`${htmlFilename}\` dosyasını tarayıcıda açın\n` +
              `2. **Ctrl+A** (tümünü seç) → **Ctrl+C** (kopyala)\n` +
              `3. Outlook'ta yeni e-posta → gövdeye **Ctrl+V** (yapıştır)\n` +
              `4. Gönderin!`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `❌ Bülten kaydedilemedi: ${(error as Error).message}`,
          },
        ],
      };
    }
  }
);

// ── Tool 5: list_newsletters ──────────────────────────────────────────────────

server.tool(
  "list_newsletters",
  "Daha önce kaydedilmiş tüm bülten dosyalarını listeler.",
  {
    outputDir: z
      .string()
      .default("newsletters")
      .describe("Bülten klasörü (varsayılan: newsletters/)"),
  },
  async ({ outputDir }) => {
    try {
      const dir = resolve(process.cwd(), outputDir);
      const files = await readdir(dir);
      const mdFiles = files
        .filter((f) => f.endsWith(".md"))
        .sort()
        .reverse();

      if (mdFiles.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: `📂 \`${dir}\` klasöründe henüz kaydedilmiş bülten yok.`,
            },
          ],
        };
      }

      const list = mdFiles
        .map((f, i) => `${i + 1}. \`${f}\``)
        .join("\n");

      return {
        content: [
          {
            type: "text" as const,
            text:
              `📂 Kayıtlı Bültenler (${mdFiles.length} dosya)\n` +
              `Klasör: \`${dir}\`\n\n` +
              list,
          },
        ],
      };
    } catch {
      return {
        content: [
          {
            type: "text" as const,
            text: `📂 Bülten klasörü henüz oluşturulmamış veya erişilemiyor.`,
          },
        ],
      };
    }
  }
);

// ── Tool 6: export_newsletter_html ──────────────────────────────────────────
// Standalone re-export for changing brand settings on an existing .md file.

server.tool(
  "export_newsletter_html",
  "Kaydedilmiş bir .md bülteni farklı marka ayarlarıyla yeniden HTML e-postaya " +
    "dönüştürür. Not: save_newsletter zaten otomatik HTML üretir; bu araç sadece " +
    "farklı logo/renk/şirket adı ile yeniden dışa aktarmak için kullanılır.",
  {
    filename: z
      .string()
      .describe(
        "Dönüştürülecek .md dosya adı (newsletters/ altında, ör: ai-bulten-developer-weekly-2026-02-28.md)"
      ),
    logoUrl: z
      .string()
      .optional()
      .describe("Şirket logosu URL (opsiyonel, uzak URL olmalı)"),
    brandColor: z
      .string()
      .default("#1a73e8")
      .describe("Marka ana rengi (hex formatında, ör: #1a73e8)"),
    companyName: z
      .string()
      .optional()
      .describe("Şirket adı (footer'da görünür)"),
    outputDir: z
      .string()
      .default("newsletters")
      .describe("Bülten klasörü (varsayılan: newsletters/)"),
  },
  async ({ filename, logoUrl, brandColor, companyName, outputDir }) => {
    try {
      const dir = resolve(process.cwd(), outputDir);
      const mdContent = await readFile(join(dir, filename), "utf-8");

      const segments = filename.replace(".md", "").split("-");
      const dateSlug = segments.slice(-3).join("-");
      const timeframeSlug = segments.at(-4) ?? "weekly";
      const personaSlug = segments.slice(2, -4).join("_");

      const inlinedHtml = await generateHtmlFromMd(
        mdContent, personaSlug, timeframeSlug, dateSlug, brandColor, logoUrl, companyName
      );

      const htmlFilename = filename.replace(/\.md$/, ".html");
      const htmlPath = join(dir, htmlFilename);
      await writeFile(htmlPath, inlinedHtml, "utf-8");

      process.stderr.write(`[HTML EXPORT] ${htmlPath}\n`);

      return {
        content: [
          {
            type: "text" as const,
            text:
              `✅ HTML e-posta başarıyla oluşturuldu!\n\n` +
              `📄 Dosya: \`${htmlPath}\`\n` +
              `🎨 Marka Rengi: ${brandColor}\n` +
              `📏 Boyut: ${(inlinedHtml.length / 1024).toFixed(1)} KB\n\n` +
              `### Outlook'ta Gönderme:\n` +
              `1. \`${htmlFilename}\` dosyasını tarayıcıda açın\n` +
              `2. **Ctrl+A** (tümünü seç) → **Ctrl+C** (kopyala)\n` +
              `3. Outlook'ta yeni e-posta → gövdeye **Ctrl+V** (yapıştır)\n` +
              `4. Gönderin!`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `❌ HTML dönüştürme hatası: ${(error as Error).message}`,
          },
        ],
      };
    }
  }
);

// ── MCP Prompts ───────────────────────────────────────────────────────────────

server.prompt(
  "ai-bulten",
  "Kişiselleştirilmiş Türkçe yapay zeka bülteni oluşturur",
  {
    persona: z
      .enum(["c_level", "product_manager", "developer", "copilot_user"])
      .default("developer")
      .describe("Hedef kitle"),
    timeframe: z
      .enum(["daily", "weekly", "monthly"])
      .default("weekly")
      .describe("Zaman dilimi"),
  },
  async ({ persona, timeframe }) => {
    const newsData = await fetchNewsData(
      persona as Persona,
      timeframe as Timeframe,
      10
    );

    const allItems = deduplicateNews([
      ...newsData.tavilyResults,
      ...newsData.rssResults,
    ]);

    const tavilyUrls = new Set(newsData.tavilyResults.map((i) => i.url));
    const dedupedTavily = allItems.filter((i) => tavilyUrls.has(i.url));
    const dedupedRss = allItems.filter((i) => !tavilyUrls.has(i.url));

    const prompt = buildNewsletterPrompt(
      persona as Persona,
      timeframe as Timeframe,
      dedupedTavily,
      dedupedRss
    );

    return {
      messages: [
        {
          role: "user" as const,
          content: { type: "text" as const, text: prompt },
        },
      ],
    };
  }
);

// ── Server Başlat ─────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write("✅ AI Haber Bülteni MCP Server başlatıldı.\n");
}

async function shutdown() {
  process.stderr.write("🛑 Server kapatılıyor...\n");
  await server.close();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

main().catch((error) => {
  process.stderr.write(`❌ Server başlatma hatası: ${(error as Error).message}\n`);
  process.exit(1);
});
