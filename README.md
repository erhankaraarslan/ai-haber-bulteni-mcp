# 🤖 AI Haber Bülteni MCP Sunucusu

Tavily API ve RSS kaynaklarından en güncel yapay zeka haberlerini çekerek
**tamamen Türkçe**, kişiselleştirilmiş bültenler oluşturan MCP sunucusu.

## ✨ Özellikler

- 📰 4 farklı hedef kitle: C-Level, Ürün Yöneticisi, Geliştirici, VS Code + Copilot
- 📅 3 farklı zaman dilimi: Günlük, Haftalık, Aylık
- 🔍 Tavily API ile gerçek zamanlı haber araması (güvenilir domain filtrelemesi dahil)
- 📡 27 güvenilir RSS kaynağı (TechCrunch, OpenAI, GitHub Copilot, Cursor, Windsurf vb.)
- ⚡ 30 dakikalık akıllı önbellekleme (cache)
- 🔄 Otomatik duplikasyon tespiti (URL + başlık benzerlik analizi)
- 🛡️ Hata toleranslı mimari (retry mekanizması, bir kaynak başarısız olursa diğerleri devam eder)
- 🎯 RSS haberleri zaman dilimine göre otomatik filtreleme
- 💰 Yapılandırılabilir Tavily arama derinliği (basic: 1 kredi, advanced: 2 kredi)
- 📝 MCP Prompts desteği (Claude Desktop'ta doğrudan seçilebilir)
- 🇹🇷 Tamamen Türkçe çıktı

## 📦 Kurulum

### Ön Koşul: Tavily API Anahtarı
[app.tavily.com](https://app.tavily.com) adresinden ücretsiz API anahtarı alın.

### Cursor ile Kullanım

`~/.cursor/mcp.json` dosyanıza ekleyin:

```json
{
  "mcpServers": {
    "ai-haber-bulteni": {
      "command": "npx",
      "args": ["-y", "ai-haber-bulteni-mcp"],
      "env": {
        "TAVILY_API_KEY": "BURAYA_TAVILY_API_ANAHTARINIZI_YAZIN"
      }
    }
  }
}
```

### VS Code + GitHub Copilot ile Kullanım

VS Code'da `.vscode/mcp.json` dosyası oluşturun (veya Command Palette > `MCP: Add Server`):

```json
{
  "servers": {
    "ai-haber-bulteni": {
      "command": "npx",
      "args": ["-y", "ai-haber-bulteni-mcp"],
      "env": {
        "TAVILY_API_KEY": "BURAYA_TAVILY_API_ANAHTARINIZI_YAZIN"
      }
    }
  }
}
```

> **Not:** VS Code'da MCP desteği için GitHub Copilot eklentisi (v1.100+) ve `chat.mcp.enabled` ayarının aktif olması gerekir. Ayarlar > `chat.mcp.enabled` > `true` yapın.

### Windsurf ile Kullanım

`~/.codeium/windsurf/mcp_config.json` dosyanıza ekleyin:

```json
{
  "mcpServers": {
    "ai-haber-bulteni": {
      "command": "npx",
      "args": ["-y", "ai-haber-bulteni-mcp"],
      "env": {
        "TAVILY_API_KEY": "BURAYA_TAVILY_API_ANAHTARINIZI_YAZIN"
      }
    }
  }
}
```

### Claude Desktop ile Kullanım

`claude_desktop_config.json` dosyanıza ekleyin:

```json
{
  "mcpServers": {
    "ai-haber-bulteni": {
      "command": "npx",
      "args": ["-y", "ai-haber-bulteni-mcp"],
      "env": {
        "TAVILY_API_KEY": "BURAYA_TAVILY_API_ANAHTARINIZI_YAZIN"
      }
    }
  }
}
```

## 🛠️ Araçlar (Tools)

| Tool | Açıklama |
|------|----------|
| `fetch_ai_news` | Ham AI haberlerini çeker (Tavily + RSS, cache destekli, tablo çıktı) |
| `generate_newsletter` | Çekilen haberleri Türkçe bülten formatına dönüştürür |
| `save_newsletter` | Bülteni `.md` + Outlook uyumlu `.html` olarak otomatik kaydeder |
| `list_newsletters` | Daha önce kaydedilmiş bülten dosyalarını listeler |
| `export_newsletter_html` | Mevcut `.md` bülteni farklı marka ayarlarıyla yeniden HTML'e dönüştürür |
| `get_available_sources` | Aktif RSS kaynaklarını persona bazında listeler |

## 📝 Prompt

| Prompt | Açıklama |
|--------|----------|
| `ai-bulten` | Kişiselleştirilmiş Türkçe AI bülteni oluşturur (Claude Desktop'ta doğrudan seçilebilir) |

## 💬 Örnek Kullanım

Cursor, Windsurf veya Claude Desktop chat'inde:

> "Geliştiriciler için bu haftaki yapay zeka bültenini oluştur"

> "C-Level yöneticiler için aylık AI bülteni hazırla"

> "Ürün yöneticileri için günlük AI haberlerini getir"

> "VS Code + Copilot kullanıcıları için haftalık bülten oluştur"

> "Hangi haber kaynakları kullanılıyor?"

> "Bu bülteni kaydet"

> "Kayıtlı bültenleri listele"

> "Developer bültenini HTML e-posta olarak dışa aktar"

> "C-Level bültenini şirket logomuz ve marka rengimizle HTML e-postaya dönüştür"

## 🔑 Parametreler

| Parametre | Değerler | Varsayılan | Açıklama |
|-----------|----------|------------|----------|
| `persona` | `c_level`, `product_manager`, `developer`, `copilot_user` | `developer` | Hedef kitle |
| `timeframe` | `daily`, `weekly`, `monthly` | `weekly` | Zaman dilimi |
| `maxItems` | `3` - `20` | `10` | Tavily toplam / RSS kaynak başına max haber |
| `searchDepth` | `basic`, `advanced` | `basic` | Tavily arama derinliği (advanced = 2x kredi) |

## 📡 RSS Kaynakları (27 kaynak)

**C-Level & Strateji:**
- **TechCrunch AI** — C-Level, PM
- **VentureBeat AI** — C-Level
- **MIT Technology Review** — C-Level, Developer
- **AI Business** — C-Level
- **NVIDIA AI Blog** — C-Level, Developer
- **Microsoft AI Blog** — C-Level, PM
- **Wired AI** — C-Level, PM

**Ürün & Platform:**
- **OpenAI News** — PM, Developer
- **Anthropic News** — PM, Developer
- **Google AI Blog** — PM, C-Level
- **The Verge AI** — PM
- **AWS Machine Learning** — PM, Developer, C-Level

**Developer & Araştırma:**
- **HuggingFace Blog** — Developer
- **Simon Willison's Blog** — Developer
- **MarkTechPost** — Developer
- **Ars Technica** — Developer
- **Towards Data Science** — Developer
- **Latent Space** — Developer

**AI Kodlama Araçları:**
- **GitHub Blog** — Developer, PM, Copilot User
- **GitHub Copilot Changelog** — Developer, Copilot User
- **VS Code Blog** — Developer, Copilot User
- **Cursor Announcements** — Developer
- **Windsurf (Codeium) Blog** — Developer

**VS Code + Copilot Ekosistemi:**
- **GitHub Changelog** — Copilot User
- **VS Code DevBlogs** — Copilot User
- **Ken Muse Blog** — Copilot User
- **GitHub AI/ML Blog** — Copilot User

## 🏗️ Geliştirme

```bash
# Klonla
git clone https://github.com/erhankaraarslan/ai-haber-bulteni-mcp.git
cd ai-haber-bulteni-mcp

# Bağımlılıkları kur
npm install

# .env dosyasını oluştur
cp .env.example .env
# .env dosyasına TAVILY_API_KEY değerini yaz

# Geliştirme modunda çalıştır
npm run dev

# Build al
npm run build

# Testleri çalıştır
npm test
```

## 🗺️ Yol Haritası (Roadmap)

- [ ] Önem puanlama (kaynak güvenilirliği ve etkileşim verilerine göre sıralama)
- [ ] Kullanıcının özel RSS kaynağı ekleyebilmesi (parametre olarak)
- [x] Outlook uyumlu HTML e-posta şablonuna dönüştürme (`export_newsletter_html`)
- [ ] Çıktı formatı seçimi (Markdown, HTML, Plain Text)
- [ ] Türkçe haber kaynakları desteği
- [ ] E-posta ile otomatik bülten gönderimi

## 📄 Lisans

MIT
