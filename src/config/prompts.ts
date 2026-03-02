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
   ⚠️ SADECE ham verideki gerçek URL'leri kullan. Asla URL uydurma veya tahmin etme.
5. Emoji ve temiz markdown formatı kullan (okunabilirlik için).
6. Uydurma haber YAZMA. Sadece sağlanan ham veriyi kullan.
7. Aynı haberin farklı kaynaklardan gelmiş versiyonları varsa birleştir, tekrar etme.
   Aynı konuyu bültenin farklı bölümlerinde tekrar işleme.
8. Bültenin başında tarih ve dönem bilgisini belirt:
   # 🤖 Yapay Zeka ${timeframeLabel} Bülteni
   📅 ${new Date().toLocaleDateString("tr-TR")} | 👤 ${config.label}
   İlk satırda TL;DR (1-2 cümlelik genel özet) ekle — okur ne bulacağını hemen anlasın.
9. ZENGİNLEŞTİRME: Ham veride rakam (milyar $, kullanıcı sayısı vb.) varsa mutlaka kullan.
   Yerel/Türkiye haberleri (Webrazzi vb.) varsa dahil et. Güvenlik/dikkat gerektiren haberleri vurgula.
10. UZUNLUK LİMİTİ: Bülten en fazla ~${config.maxLines} satır olmalı. Bu limiti aşma.
   Haberlerin hepsini dahil etmek zorunda değilsin; en önemli ${config.maxNewsItems} haberi seç.
11. KAYNAK ÇEŞİTLİLİĞİ ZORUNLU: Bültende en az 6 farklı kaynaktan (ör. MIT Technology Review,
   Wired, NVIDIA AI Blog, Google AI Blog, AWS, Webrazzi, The Verge, AI Business, VentureBeat)
   haber dahil et. Sadece TechCrunch, Bloomberg, Reuters'a odaklanma. RSS bölümündeki
   farklı kaynaklara mutlaka yer ver.
12. İÇERİK KURALLARI (bu persona için özel):
${config.contentGuidelines}

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
yapay zeka bülteni yaz.

⚠️ ÖNEMLİ: Bülteni yazdıktan sonra OTOMATIK olarak \`save_newsletter\` aracını çağırarak
.md ve .html dosyalarını kaydet. Kullanıcıya "kaydetmemi ister misiniz?" diye SORMA,
doğrudan kaydet.`;
}
