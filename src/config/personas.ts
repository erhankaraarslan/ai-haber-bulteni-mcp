import type { Persona, Timeframe } from "../types/index.js";

interface PersonaConfig {
  label: string;
  tavilyQuery: string;
  tone: string;
  newsletterFormat: string;
  maxNewsItems: number;
  maxLines: number;
  contentGuidelines: string;
}

export const PERSONA_CONFIG: Record<Persona, PersonaConfig> = {
  c_level: {
    label: "C-Level Yöneticiler (CEO, CTO, VP)",
    tavilyQuery:
      "AI startup investments funding, AI regulations policy, enterprise AI adoption ROI, " +
      "AI market analysis report, AI acquisitions mergers",
    tone:
      "Stratejik ve üst düzey bakış açısı kullan. Yatırım, pazar payı, rekabet avantajı " +
      "gibi iş odaklı terimlere ağırlık ver. Teknik detaylardan kesinlikle kaçın; API, model " +
      "mimarisi, framework gibi teknik terimler kullanma. 'Bu şirketiniz için ne anlama geliyor?' " +
      "sorusunu her haber için yanıtla. Kısa ve öz ol; yöneticilerin zamanı kısıtlıdır.",
    maxNewsItems: 8,
    maxLines: 200,
    contentGuidelines:
      "- Sadece stratejik öneme sahip haberleri dahil et (yatırım, ortaklık, düzenleme, pazar hareketi).\n" +
      "- Niş teknik ürün lansmanlarını (ör. yeni bir embedding modeli) ATLAMA.\n" +
      "- Her haberde 'Şirketiniz için ne anlama geliyor' bölümü ZORUNLU.\n" +
      "- Kaynak tablosunu en fazla 15 satırla sınırla.\n" +
      "- Tek bir bulut sağlayıcıya (AWS, Azure vb.) ağırlık verme; dengeli ol.",
    newsletterFormat: `
## 📊 Yönetici Özeti (En önemli 3 gelişmenin tek cümlelik özeti)
## 💰 Yatırım & Pazar Hareketleri
## ⚖️ Düzenleyici Gelişmeler
## 🎯 Stratejik Çıkarımlar & Önerilen Aksiyonlar
## 🔗 Tüm Kaynaklar (en fazla 15)`,
  },

  product_manager: {
    label: "Ürün Yöneticileri (Product Manager)",
    tavilyQuery:
      "new AI product launches features, ChatGPT Claude Gemini updates, " +
      "AI tool UX improvements, AI product roadmap announcements",
    tone:
      "Pratik, kullanıcı odaklı ve özellik karşılaştırmalı. Yeni özellikleri, UX trendlerini " +
      "ve rakip ürün güncellemelerini detaylıca ele al. Her haberi 'Bu özellik ürün yol haritanızı " +
      "nasıl etkiler?' perspektifinden değerlendir.",
    maxNewsItems: 10,
    maxLines: 300,
    contentGuidelines:
      "- Her haberin sonuna 'PM notu:' ile kısa bir ürün stratejisi çıkarımı ekle.\n" +
      "- Mümkün olan her yerde fiyatlandırma/maliyet karşılaştırma tablosu oluştur.\n" +
      "- Rakip Karşılaştırma Tablosu bölümünde en az 3 sütun (özellik, fiyat, hedef kitle) kullan.\n" +
      "- Yatırım/düzenleme haberlerini kısa tut; ürün etkisine odaklan.\n" +
      "- Aynı haberi birden fazla bölümde tekrar etme.",
    newsletterFormat: `
## 🚀 Bu Dönem Ne Değişti? (Öne çıkan 3 gelişme)
## 🔍 Ürün & Özellik İncelemeleri
## 📱 UX & Tasarım Trendleri
## 🆚 Rakip Karşılaştırma Tablosu (varsa)
## 💡 PM'ler İçin Çıkarımlar
## 🔗 Tüm Kaynaklar`,
  },

  developer: {
    label: "Yazılım Geliştiriciler / Mühendisler",
    tavilyQuery:
      "open source LLM models released, new AI coding tools APIs, " +
      "RAG vector database updates, AI developer tools GitHub",
    tone:
      "Teknik, derinlemesine ve uygulamalı. Yeni modeller, açık kaynak araçlar, API " +
      "değişiklikleri ve performans kıyaslamaları detaylıca işlenmeli. Kod örnekleri veya " +
      "GitHub linkleri varsa mutlaka dahil et. Framework/kütüphane güncellemelerini detaylı açıkla.",
    maxNewsItems: 10,
    maxLines: 300,
    contentGuidelines:
      "- Her araç/kütüphane için GitHub linki veya kurulum komutu (npm install / pip install) ZORUNLU.\n" +
      "- 'Hızlı Başlangıç' bölümünde en az 5 araç olsun, her biri bash/shell komutuyla.\n" +
      "- Tek bir bulut sağlayıcıya (AWS, GCP, Azure) ağırlık verme; açık kaynak araçlara öncelik ver.\n" +
      "- Tamamen akademik/teorik makaleleri kısa tut veya atla; pratik uygulanabilirliğe odaklan.\n" +
      "- Yatırım/kurumsal haberler en fazla 2-3 cümle ile özetlensin.\n" +
      "- Aynı haberi birden fazla bölümde tekrar etme.",
    newsletterFormat: `
## 🔥 Bu Dönem Trending (En önemli 3 gelişme)
## 🧠 Yeni Modeller & Araştırmalar
## 🛠️ Geliştirici Araçları & API Güncellemeleri
## 📦 Açık Kaynak Hazineleri
## ⚡ Hızlı Başlangıç: Denemeye Değer (kurulum komutları ile)
## 🔗 Tüm Kaynaklar`,
  },

  copilot_user: {
    label: "VS Code + GitHub Copilot Kullanıcıları",
    tavilyQuery:
      "GitHub Copilot new features updates agent mode, VS Code AI extensions MCP server, " +
      "copilot-instructions.md context engineering prompt files, " +
      "GitHub Copilot premium requests token cost optimization, " +
      "VS Code AI coding assistant tips best practices 2026",
    tone:
      "Pratik, aksiyona dönük ve 'hemen uygula' odaklı. Her haberin sonunda 'bunu şimdi nasıl " +
      "denersiniz' bilgisi olmalı. Karşılaştırma tabloları (model bazında maliyet, özellik farkı " +
      "vb.) tercih edilmeli. Gereksiz teorik açıklamalardan kaçınılmalı; okuyucu zaten VS Code " +
      "kullandığı için temel kavramları bilir.",
    maxNewsItems: 10,
    maxLines: 250,
    contentGuidelines:
      "- Her haberin sonunda '> **Hemen Deneyin:**' bloğu ZORUNLU — VS Code'da nasıl uygulanacağını yaz.\n" +
      "- VS Code ayarları (settings.json), extension önerileri ve konfigürasyon örnekleri ekle.\n" +
      "- copilot-instructions.md ve .github/copilot-instructions.md dosya örnekleri ver.\n" +
      "- Copilot ile doğrudan ilgisi olmayan haberleri (ör. sektörel yatırım) en fazla 1-2 cümleyle özetle.\n" +
      "- Kaynak URL'lerini yalnızca ham verideki gerçek URL'lerden al; asla uydurma.\n" +
      "- Aynı haberi birden fazla bölümde tekrar etme.",
    newsletterFormat: `
## 🔔 Haftanın Önemli Güncellemeleri (Top 3)
## 🤖 Copilot & VS Code Yeni Özellikler
## 🧩 Context Engineering & Prompt Yönetimi
## 💰 Maliyet Optimizasyonu & Premium Request İpuçları
## 🔌 MCP Sunucuları & Eklenti Ekosistemi
## 💡 Haftanın İpucu (Hemen Deneyin)
## 🔗 Tüm Kaynaklar`,
  },

  cursor_user: {
    label: "Cursor IDE Kullanıcıları",
    tavilyQuery:
      "Cursor AI IDE new features updates agent mode, cursor rules .cursor/rules AGENTS.md, " +
      "Cursor composer MCP server integration, Cursor AI code editor tips best practices, " +
      "Cursor vs Copilot vs Windsurf comparison 2026",
    tone:
      "Pratik, iş akışı odaklı ve 'hemen dene' yaklaşımlı. Cursor'a özgü özellikler " +
      "(Agent mode, Composer, Rules, MCP entegrasyonu) ön planda olmalı. Her haberin sonunda " +
      "Cursor'da nasıl uygulanacağı belirtilmeli. Model karşılaştırmaları (Claude vs GPT vs " +
      "Gemini maliyet/performans) tablolarla desteklenmeli. Okuyucu Cursor kullanıcısı olduğu " +
      "için IDE temellerini açıklamaya gerek yok.",
    maxNewsItems: 10,
    maxLines: 320,
    contentGuidelines:
      "- Her haberin sonunda '**Cursor'da nasıl denersiniz:**' bloğu ZORUNLU.\n" +
      "- .cursor/rules/ dosya örnekleri ve MCP yapılandırma JSON snippet'leri ekle.\n" +
      "- Agent Mode, Composer ve Cloud Agents bağlamında değerlendir.\n" +
      "- Yatırım/pazar haberlerini en fazla 2-3 cümleyle özetle; Cursor bağlantısını kur.\n" +
      "- Kaynak URL'lerini yalnızca ham verideki gerçek URL'lerden al; asla uydurma.\n" +
      "- Aynı konuyu birden fazla bölümde tekrar etme; ilk işlenen bölümde detaylandır.",
    newsletterFormat: `
## 🔔 Haftanın Önemli Güncellemeleri (Top 3)
## ⚡ Cursor Yeni Özellikler & Güncellemeler
## 📐 Cursor Rules & Context Engineering
## 🧠 AI Model Güncellemeleri (Claude, GPT, Gemini)
## 🔌 MCP Sunucuları & Entegrasyonlar
## 💡 Haftanın İpucu (Hemen Deneyin)
## 🔗 Tüm Kaynaklar`,
  },

  windsurf_user: {
    label: "Windsurf IDE Kullanıcıları",
    tavilyQuery:
      "Windsurf AI IDE new features updates, Windsurf cascade flows agentic coding, " +
      "Windsurf rules .windsurfrules AI context, Windsurf MCP server integration, " +
      "Windsurf vs Cursor vs Copilot comparison 2026",
    tone:
      "Pratik, iş akışı odaklı ve 'hemen dene' yaklaşımlı. Windsurf'e özgü özellikler " +
      "(Cascade, Flows, Rules, MCP entegrasyonu) ön planda olmalı. Her haberin sonunda " +
      "Windsurf'te nasıl uygulanacağı belirtilmeli. Model karşılaştırmaları tablolarla " +
      "desteklenmeli. Okuyucu Windsurf kullanıcısı olduğu için IDE temellerini açıklamaya gerek yok.",
    maxNewsItems: 10,
    maxLines: 320,
    contentGuidelines:
      "- Her haberin sonunda '**Windsurf'te nasıl kullanılır:**' bloğu ZORUNLU.\n" +
      "- Cascade, Flows ve Rules dosya (.windsurfrules) örnekleri ekle.\n" +
      "- Cursor ve Copilot ile üçlü karşılaştırma tabloları oluştur.\n" +
      "- Windsurf changelog'undan gelen güncellemelere öncelik ver.\n" +
      "- Yatırım/pazar haberlerini en fazla 2-3 cümleyle özetle; Windsurf bağlantısını kur.\n" +
      "- Kaynak URL'lerini yalnızca ham verideki gerçek URL'lerden al; asla uydurma.\n" +
      "- Aynı konuyu birden fazla bölümde tekrar etme.",
    newsletterFormat: `
## 🔔 Haftanın Önemli Güncellemeleri (Top 3)
## 🏄 Windsurf Yeni Özellikler & Güncellemeler
## 🌊 Cascade & Flows İpuçları
## 🧠 AI Model Güncellemeleri (Claude, GPT, Gemini)
## 🔌 MCP Sunucuları & Entegrasyonlar
## 💡 Haftanın İpucu (Hemen Deneyin)
## 🔗 Tüm Kaynaklar`,
  },
};

export const TIMEFRAME_MAP: Record<Timeframe, string> = {
  daily: "day",
  weekly: "week",
  monthly: "month",
};

export const TIMEFRAME_LABELS: Record<Timeframe, string> = {
  daily: "Günlük",
  weekly: "Haftalık",
  monthly: "Aylık",
};
