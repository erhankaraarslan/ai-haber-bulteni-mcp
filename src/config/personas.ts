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
      "OpenAI Anthropic Google Microsoft AI funding investment billion dollar, " +
      "AI regulation policy EU US China, enterprise AI adoption ROI case study, " +
      "AI market analysis report 2025 2026, AI startup acquisition merger, " +
      "Nvidia AMD data center AI chip demand",
    tone:
      "Stratejik ve üst düzey bakış açısı kullan. Yatırım, pazar payı, rekabet avantajı " +
      "gibi iş odaklı terimlere ağırlık ver. Teknik detaylardan kesinlikle kaçın; API, model " +
      "mimarisi, framework gibi teknik terimler kullanma. 'Bu şirketiniz için ne anlama geliyor?' " +
      "sorusunu her haber için yanıtla. Kısa ve öz ol; yöneticilerin zamanı kısıtlıdır.",
    maxNewsItems: 12,
    maxLines: 240,
    contentGuidelines:
      "- Sadece stratejik öneme sahip haberleri dahil et (yatırım, ortaklık, düzenleme, pazar hareketi).\n" +
      "- Niş teknik ürün lansmanlarını (ör. yeni bir embedding modeli) ATLAMA.\n" +
      "- Her haberde 'Şirketiniz için ne anlama geliyor' bölümü ZORUNLU.\n" +
      "- Kaynak tablosunu en fazla 15 satırla sınırla.\n" +
      "- Tek bir bulut sağlayıcıya (AWS, Azure vb.) ağırlık verme; dengeli ol.\n" +
      "- 'Rakamlarla' bölümünde gerçek verilerden (milyar $, kullanıcı sayısı vb.) maddeler listele.\n" +
      "- Webrazzi vb. Türkçe kaynaklardan Türkiye ile ilgili haber varsa mutlaka dahil et.",
    newsletterFormat: `
## 📊 Yönetici Özeti (En önemli 3 gelişmenin tek cümlelik özeti)
## 📈 Bu Dönem Rakamlarla (yatırım tutarları, pazar büyüklükleri, kullanıcı sayıları — varsa)
## 💰 Yatırım & Pazar Hareketleri
## ⚖️ Düzenleyici Gelişmeler
## 🎯 Stratejik Çıkarımlar & Önerilen Aksiyonlar
## 🇹🇷 Türkiye Açısı (yerel haber, Türk şirketleri, bölgesel pazar — varsa)
## 🔗 Tüm Kaynaklar (en fazla 15)`,
  },

  product_manager: {
    label: "Ürün Yöneticileri (Product Manager)",
    tavilyQuery:
      "ChatGPT Claude Gemini new features launch 2025 2026, " +
      "AI product UX design patterns agentic interface, " +
      "AI pricing model comparison enterprise vs consumer, " +
      "AI product roadmap announcement OpenAI Anthropic Google, " +
      "conversational AI chatbot product update",
    tone:
      "Pratik, kullanıcı odaklı ve özellik karşılaştırmalı. Yeni özellikleri, UX trendlerini " +
      "ve rakip ürün güncellemelerini detaylıca ele al. Her haberi 'Bu özellik ürün yol haritanızı " +
      "nasıl etkiler?' perspektifinden değerlendir.",
    maxNewsItems: 14,
    maxLines: 350,
    contentGuidelines:
      "- Her haberin sonuna 'PM notu:' ile kısa bir ürün stratejisi çıkarımı ekle.\n" +
      "- Mümkün olan her yerde fiyatlandırma/maliyet karşılaştırma tablosu oluştur.\n" +
      "- Rakip Karşılaştırma Tablosu bölümünde en az 3 sütun (özellik, fiyat, hedef kitle) kullan.\n" +
      "- Yatırım/düzenleme haberlerini kısa tut; ürün etkisine odaklan.\n" +
      "- Aynı haberi birden fazla bölümde tekrar etme.\n" +
      "- Rakip tablosu mutlaka olsun; en az 2 ürün/platform karşılaştır.",
    newsletterFormat: `
## 🚀 Bu Dönem Ne Değişti? (Öne çıkan 3 gelişme)
## 📈 Rakamlarla (fiyat, kullanıcı, pazar büyüklüğü — varsa)
## 🔍 Ürün & Özellik İncelemeleri
## 📱 UX & Tasarım Trendleri
## 🆚 Rakip Karşılaştırma Tablosu (en az 1 tablo — özellik, fiyat, hedef kitle)
## 💡 PM'ler İçin Çıkarımlar
## 📚 Okuma Önerisi (en derinlemesine haber için 1-2 ek link — varsa)
## 🔗 Tüm Kaynaklar`,
  },

  developer: {
    label: "Yazılım Geliştiriciler / Mühendisler",
    tavilyQuery:
      "open source LLM Llama Mistral released HuggingFace, " +
      "AI coding tools API Cursor Copilot Claude Code, " +
      "RAG retrieval augmented generation vector database, " +
      "GitHub AI developer tools MCP Model Context Protocol, " +
      "embedding model fine-tuning LoRA 2025",
    tone:
      "Teknik, derinlemesine ve uygulamalı. Yeni modeller, açık kaynak araçlar, API " +
      "değişiklikleri ve performans kıyaslamaları detaylıca işlenmeli. Kod örnekleri veya " +
      "GitHub linkleri varsa mutlaka dahil et. Framework/kütüphane güncellemelerini detaylı açıkla.",
    maxNewsItems: 14,
    maxLines: 350,
    contentGuidelines:
      "- Her araç/kütüphane için GitHub linki veya kurulum komutu (npm install / pip install) ZORUNLU.\n" +
      "- 'Hızlı Başlangıç' bölümünde en az 5 araç olsun, her biri bash/shell komutuyla.\n" +
      "- Tek bir bulut sağlayıcıya (AWS, GCP, Azure) ağırlık verme; açık kaynak araçlara öncelik ver.\n" +
      "- Tamamen akademik/teorik makaleleri kısa tut veya atla; pratik uygulanabilirliğe odaklan.\n" +
      "- Yatırım/kurumsal haberler en fazla 2-3 cümle ile özetlensin.\n" +
      "- Aynı haberi birden fazla bölümde tekrar etme.\n" +
      "- Güvenlik açığı, deprecation veya breaking change varsa 'Dikkat' bölümünde vurgula.",
    newsletterFormat: `
## 🔥 Bu Dönem Trending (En önemli 3 gelişme)
## 🧠 Yeni Modeller & Araştırmalar
## 🛠️ Geliştirici Araçları & API Güncellemeleri
## 📦 Açık Kaynak Hazineleri
## ⚡ Hızlı Başlangıç: Denemeye Değer (kurulum komutları ile — en az 5 araç)
## 📖 Haftanın Terimi (bültendeki teknik bir kavramı 1-2 cümleyle açıkla — RAG, LoRA, MCP vb.)
## ⚠️ Dikkat (güvenlik, breaking change, deprecation — varsa)
## 🔗 Tüm Kaynaklar`,
  },

  copilot_user: {
    label: "VS Code + GitHub Copilot Kullanıcıları",
    tavilyQuery:
      "GitHub Copilot agent mode new features 2025 2026, " +
      "VS Code AI extension MCP Model Context Protocol, " +
      "copilot-instructions context engineering prompt, " +
      "GitHub Copilot token cost premium request optimization, " +
      "VS Code Cursor Windsurf AI coding comparison, " +
      "Claude Codex GPT Copilot model selector",
    tone:
      "Pratik, aksiyona dönük ve 'hemen uygula' odaklı. Her haberin sonunda 'bunu şimdi nasıl " +
      "denersiniz' bilgisi olmalı. Karşılaştırma tabloları (model bazında maliyet, özellik farkı " +
      "vb.) tercih edilmeli. Gereksiz teorik açıklamalardan kaçınılmalı; okuyucu zaten VS Code " +
      "kullandığı için temel kavramları bilir.",
    maxNewsItems: 14,
    maxLines: 280,
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
## 💰 Maliyet Optimizasyonu & Premium Request İpuçları (tablo ile)
## 🔌 MCP Sunucuları & Eklenti Ekosistemi
## 🆚 Cursor / Windsurf ile Karşılaştırma (özellik farkı — varsa)
## 💡 Haftanın İpucu (Hemen Deneyin)
## 🔗 Tüm Kaynaklar`,
  },

  cursor_user: {
    label: "Cursor IDE Kullanıcıları",
    tavilyQuery:
      "Cursor IDE cloud agents computer use 2025 2026, " +
      "Cursor rules .cursor/rules MCP integration, " +
      "Cursor Composer Agent Mode new features, " +
      "Cursor vs Copilot vs Windsurf AI coding comparison, " +
      "Claude GPT Gemini Cursor model settings, " +
      "agentic coding Simon Willison Cursor tips",
    tone:
      "Pratik, iş akışı odaklı ve 'hemen dene' yaklaşımlı. Cursor'a özgü özellikler " +
      "(Agent mode, Composer, Rules, MCP entegrasyonu) ön planda olmalı. Her haberin sonunda " +
      "Cursor'da nasıl uygulanacağı belirtilmeli. Model karşılaştırmaları (Claude vs GPT vs " +
      "Gemini maliyet/performans) tablolarla desteklenmeli. Okuyucu Cursor kullanıcısı olduğu " +
      "için IDE temellerini açıklamaya gerek yok.",
    maxNewsItems: 14,
    maxLines: 360,
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
## 🆚 Copilot / Windsurf ile Karşılaştırma (özellik farkı — varsa)
## 💡 Haftanın İpucu (Hemen Deneyin)
## 🔗 Tüm Kaynaklar`,
  },

  windsurf_user: {
    label: "Windsurf IDE Kullanıcıları",
    tavilyQuery:
      "Windsurf Codeium IDE new features 2025 2026, " +
      "Windsurf Cascade Flows agentic coding, " +
      "Windsurf rules .windsurfrules context, " +
      "Windsurf MCP server Figma Jira integration, " +
      "Windsurf vs Cursor vs Copilot comparison, " +
      "Cascade model Claude GPT Gemini Windsurf",
    tone:
      "Pratik, iş akışı odaklı ve 'hemen dene' yaklaşımlı. Windsurf'e özgü özellikler " +
      "(Cascade, Flows, Rules, MCP entegrasyonu) ön planda olmalı. Her haberin sonunda " +
      "Windsurf'te nasıl uygulanacağı belirtilmeli. Model karşılaştırmaları tablolarla " +
      "desteklenmeli. Okuyucu Windsurf kullanıcısı olduğu için IDE temellerini açıklamaya gerek yok.",
    maxNewsItems: 14,
    maxLines: 360,
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
## 🆚 Cursor / Copilot ile Karşılaştırma (özellik farkı — varsa)
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
