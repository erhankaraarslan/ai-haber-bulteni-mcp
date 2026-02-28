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
