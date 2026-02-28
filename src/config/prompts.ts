import type { Persona, Timeframe, NewsItem } from "../types/index.js";
import { PERSONA_CONFIG, TIMEFRAME_LABELS } from "./personas.js";

function sanitizeContent(text: string): string {
  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/SYSTEM INSTRUCTION/gi, "[FILTERED]")
    .replace(/IGNORE PREVIOUS/gi, "[FILTERED]")
    .replace(/```/g, "~~~")
    .trim();
}

export function buildNewsletterPrompt(
  persona: Persona,
  timeframe: Timeframe,
  tavilyItems: NewsItem[],
  rssItems: NewsItem[]
): string {
  const config = PERSONA_CONFIG[persona];
  const timeframeLabel = TIMEFRAME_LABELS[timeframe];

  const systemInstruction = `
SYSTEM INSTRUCTION FOR LLM:
Aşağıda çeşitli yapay zeka haber kaynaklarından toplanmış ham veriler bulunmaktadır.
Sen uzman bir Yapay Zeka Bülteni Editörüsün. Görevin bu veriyi kullanarak
yapılandırılmış ve ilgi çekici bir bülten yazmaktır.

KURALLAR (MUTLAKA UYULMALI):
1. Bültenin TAMAMI KESİNLİKLE TÜRKÇE yazılacak. İngilizce kelime veya cümle kullanma.
   Teknik terimler Türkçe karşılığıyla kullanılabilir (gerekirse parantez içinde orijinali).
2. Hedef kitle: **${config.label}**
   Ton ve terminoloji bu kitleye göre ayarlanacak: ${config.tone}
3. Aşağıdaki bölüm yapısını kullan:
   ${config.newsletterFormat}
4. Her haber maddesinin sonuna mutlaka kaynak URL'sini referans linki olarak ekle.
   Format: *Kaynak: [Yayın Adı](url)*
5. Emoji ve temiz markdown formatı kullan (okunabilirlik için).
6. Uydurma haber YAZMA. Sadece sağlanan ham veriyi kullan.
7. Aynı haberin farklı kaynaklardan gelmiş versiyonları varsa birleştir, tekrar etme.
8. Bültenin başında tarih ve dönem bilgisini belirt:
   # 🤖 Yapay Zeka ${timeframeLabel} Bülteni
   📅 ${new Date().toLocaleDateString("tr-TR")} | 👤 ${config.label}

--- HAM VERİ BAŞLANGIÇ ---
`;

  const tavilySection = tavilyItems.length > 0
    ? tavilyItems
        .map(
          (item, i) => `
[TAVILY-${i + 1}]
Başlık: ${sanitizeContent(item.title)}
Özet: ${sanitizeContent(item.summary)}
Kaynak: ${sanitizeContent(item.source)}
URL: ${item.url}
Tarih: ${item.publishedAt ?? "Belirtilmemiş"}
Alaka Skoru: ${item.relevanceScore?.toFixed(2) ?? "N/A"}`
        )
        .join("\n")
    : "(Tavily'den sonuç alınamadı)";

  const rssSection = rssItems.length > 0
    ? rssItems
        .map(
          (item, i) => `
[RSS-${i + 1}]
Başlık: ${sanitizeContent(item.title)}
Özet: ${sanitizeContent(item.summary)}
Kaynak: ${sanitizeContent(item.source)}
URL: ${item.url}
Tarih: ${item.publishedAt ?? "Belirtilmemiş"}`
        )
        .join("\n")
    : "(RSS kaynaklarından sonuç alınamadı)";

  return `${systemInstruction}
=== TAVİLY ARAMA SONUÇLARI (${tavilyItems.length} haber) ===
${tavilySection}

=== RSS KAYNAK HABERLERİ (${rssItems.length} haber) ===
${rssSection}

--- HAM VERİ BİTİŞ ---

Şimdi yukarıdaki verileri kullanarak ${config.label} hedef kitlesine yönelik,
tamamen Türkçe, profesyonel ve ilgi çekici bir ${timeframeLabel.toLowerCase()}
yapay zeka bülteni yaz.`;
}
