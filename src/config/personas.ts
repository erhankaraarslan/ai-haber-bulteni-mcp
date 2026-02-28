import type { Persona, Timeframe } from "../types/index.js";

interface PersonaConfig {
  label: string;
  tavilyQuery: string;
  tone: string;
  newsletterFormat: string;
}

export const PERSONA_CONFIG: Record<Persona, PersonaConfig> = {
  c_level: {
    label: "C-Level Yöneticiler (CEO, CTO, VP)",
    tavilyQuery:
      "AI startup investments funding, AI regulations policy, enterprise AI adoption ROI, " +
      "AI market analysis report, AI acquisitions mergers",
    tone:
      "Stratejik ve üst düzey bakış açısı kullan. Yatırım, pazar payı, rekabet avantajı " +
      "gibi iş odaklı terimlere ağırlık ver. Teknik detaylardan kaçın; 'bu şirketiniz için " +
      "ne anlama geliyor?' sorusunu yanıtla. Kısa ve öz ol; yöneticilerin zamanı kısıtlıdır.",
    newsletterFormat: `
## 📊 Yönetici Özeti (En önemli 3 gelişmenin tek cümlelik özeti)
## 💰 Yatırım & Pazar Hareketleri
## ⚖️ Düzenleyici Gelişmeler
## 🎯 Stratejik Çıkarımlar & Önerilen Aksiyonlar
## 🔗 Tüm Kaynaklar`,
  },

  product_manager: {
    label: "Ürün Yöneticileri (Product Manager)",
    tavilyQuery:
      "new AI product launches features, ChatGPT Claude Gemini updates, " +
      "AI tool UX improvements, AI product roadmap announcements",
    tone:
      "Pratik, kullanıcı odaklı ve özellik karşılaştırmalı. Yeni özellikleri, UX trendlerini " +
      "ve rakip ürün güncellemelerini detaylıca ele al. 'Bu özellik ürün yol haritanızı nasıl " +
      "etkiler?' perspektifinden yaz.",
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
