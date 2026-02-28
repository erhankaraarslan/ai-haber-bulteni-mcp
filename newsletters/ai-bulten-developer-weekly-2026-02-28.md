# 🤖 Yapay Zeka Haftalık Bülteni
📅 28.02.2026 | 👤 Yazılım Geliştiriciler / Mühendisler

---

## 🔥 Bu Dönem Trending (En Önemli 3 Gelişme)

**1. Cursor Bulut Ajanları Artık Bilgisayar Kullanabiliyor**
Cursor, bulut ajanlarına devrim niteliğinde bir güncelleme getirdi. Ajanlar artık izole sanal makinelerde kendi geliştirme ortamlarıyla çalışıyor: tarayıcı açıyor, localhost'a gidiyor, arayüzde tıklıyor ve değişikliklerin gerçekten çalıştığını doğrulayabiliyor. Bir şey bozuksa yeniden deniyor, bitirdiğinde ise özelliği gösteren bir video kaydediyor. Cursor'ın kendi birleştirilen PR'larının **%30'undan fazlası** artık bu otonom ajanlar tarafından oluşturuluyor. Web, masaüstü, mobil, Slack veya GitHub üzerinden başlatılabiliyor.
*Kaynak: [Cursor Announcements](https://forum.cursor.com/t/cloud-agents-with-computer-use/152829)*

**2. GPT-5.3-Codex GitHub Copilot'ta Kullanıma Açıldı**
OpenAI'ın GPT-5.3-Codex modeli artık GitHub.com, GitHub Mobile ve Visual Studio'da GitHub Copilot Chat üzerinden kullanılabilir durumda. Copilot Enterprise, Business, Pro ve Pro+ kullanıcıları erişebiliyor. Aynı hafta içinde Claude (Anthropic) ve Codex, Copilot Business ve Pro kullanıcıları için kodlama ajanı olarak da aktifleştirildi.
*Kaynak: [GitHub Copilot Changelog](https://github.blog/changelog/2026-02-25-gpt-5-3-codex-is-now-available-in-github-com-github-mobile-and-visual-studio)*

**3. Claude Cowork Kurumsal Alana Giriyor — Spotify %90 Mühendislik Süresi Azalttı**
Anthropic, Claude Cowork'ün kurumsal yeteneklerini duyurdu. Spotify entegrasyonu özellikle dikkat çekiyor: mühendisler doğal dille büyük ölçekli geçişleri başlatabiliyor, ayda 650'den fazla yapay zeka destekli kod değişikliği gönderiliyor ve güncellemelerin yaklaşık yarısı bu sistem üzerinden akıyor. MCP (Model Context Protocol) bu yapının bağlayıcı dokusu haline gelmiş durumda.
*Kaynak: [VentureBeat](https://venturebeat.com/orchestration/anthropic-says-claude-code-transformed-programming-now-claude-cowork-is)*

---

## 🧠 Yeni Modeller & Araştırmalar

### Guide Labs Steerling-8B: Yorumlanabilir Büyük Dil Modeli
Guide Labs, 8 milyar parametreli açık kaynak bir model olan **Steerling-8B**'yi yayınladı. Modelin en dikkat çekici özelliği: ürettiği her bir belirteç (token), eğitim verisindeki kaynağına geri izlenebiliyor. Mevcut modellerin %90 kapasitesine ulaşırken daha az eğitim verisi kullanıyor. Kurucuya göre "yorumlanabilir model eğitimi artık bir bilim değil, bir mühendislik problemi."
*Kaynak: [TechCrunch](https://techcrunch.com/2026/02/23/guide-labs-debuts-a-new-kind-of-interpretable-llm/)*

### HuggingFace: Transformer'larda Uzman Karışımı (MoE) Rehberi
HuggingFace, Transformer mimarisinde Mixture of Experts (MoE) yapısını detaylıca anlatan kapsamlı bir teknik rehber yayınladı. Seyrek aktivasyon, yönlendirme mekanizmaları ve verimli çıkarım stratejileri ele alınıyor.
*Kaynak: [HuggingFace Blog](https://huggingface.co/blog/moe-transformers)*

### OpenAI: SWE-bench Verified Artık Değerlendirilmiyor
OpenAI, SWE-bench Verified kıyaslamasının giderek artan kontaminasyon ve eğitim sızıntısı nedeniyle güvenilirliğini yitirdiğini açıkladı. Yerine **SWE-bench Pro** önerildi. Sınır model kodlama performansını daha doğru ölçen yeni bir standart gerekiyor.
*Kaynak: [OpenAI](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified)*

### Kodlama Ajanlarıyla Skeptik Bir Geliştirici Deneyimi
Max Woolf, kodlama ajanlarıyla deneyimlerini detaylıca paylaştı. YouTube metadata toplayıcılarından başlayıp Python'un scikit-learn kütüphanesini Rust'a taşımaya kadar giden bir serüven. Opus 4.6/Codex 5.3 hakkında: "Aylar önce çıkan modellerden büyüklük sırası daha iyi demek klişe gibi duyuluyor ama bu sinir bozucu bir gerçek."
*Kaynak: [Simon Willison's Blog](https://simonwillison.net/2026/Feb/27/ai-agent-coding-in-excessive-detail/#atom-everything)*

---

## 🛠️ Geliştirici Araçları & API Güncellemeleri

### GitHub Copilot Kodlama Ajanı — Yeni Özellikler
Model seçici, kendi kendine inceleme (self-review), yerleşik güvenlik taraması, özel ajanlar ve komut satırı aktarımı eklendi. Birden fazla modelden seçim yapılabiliyor ve ajan çıktıları güvenlik açısından otomatik taranıyor.
*Kaynak: [GitHub Blog](https://github.blog/ai-and-ml/github-copilot/whats-new-with-github-copilot-coding-agent/)*

### Figma + OpenAI Codex Entegrasyonu (MCP Destekli)
Figma, OpenAI Codex'i entegre etti. MCP sunucusu üzerinden kod ve tasarım arasında sorunsuz geçiş yapılabiliyor. Bir hafta önce Anthropic Claude Code ile de benzer ortaklık kurulmuştu.
*Kaynak: [TechCrunch](https://techcrunch.com/2026/02/26/figma-partners-with-openai-to-bake-in-support-for-codex/)*

### VS Code: Uzun Mesafeli Sonraki Düzenleme Önerileri
Copilot'un "sonraki düzenleme önerisi" özelliği dosyanın tamamında çalışacak şekilde genişletildi. Dosya genelindeki bağlamsal düzenleme noktaları artık önerilere dahil.
*Kaynak: [VS Code Blog](https://code.visualstudio.com/blogs/2026/02/26/long-distance-nes)*

### GitHub Copilot CLI Rehberi: Fikirden PR'a
GitHub, Copilot CLI ile niyet belirlemeden incelenebilir değişikliklere nasıl geçileceğini anlatan kapsamlı bir rehber yayınladı.
*Kaynak: [GitHub Blog](https://github.blog/ai-and-ml/github-copilot/from-idea-to-pull-request-a-practical-guide-to-building-with-github-copilot-cli/)*

### GitHub Kurumsal AI Kontrolleri — Genel Kullanıma Açıldı
Enterprise AI kontrolleri ve ajan kontrol düzlemi genel kullanıma sunuldu. İçerik dışlama kuralları artık REST API ile programatik olarak yönetilebiliyor.
*Kaynak: [GitHub Changelog](https://github.blog/changelog/2026-02-26-enterprise-ai-controls-agent-control-plane-now-generally-available)*

### AWS: vLLM ile Düzinelerce İnce Ayarlı Model Sunumu
AWS, SageMaker AI ve Amazon Bedrock üzerinde vLLM ile çoklu LoRA çıkarımının MoE modelleri için nasıl uygulandığını detaylıca açıkladı. Çekirdek düzeyinde optimizasyonlar ve GPT-OSS 20B örneği paylaşıldı.
*Kaynak: [AWS Machine Learning](https://aws.amazon.com/blogs/machine-learning/efficiently-serve-dozens-of-fine-tuned-models-with-vllm-on-amazon-sagemaker-ai-and-amazon-bedrock/)*

### Amazon Nova için Pekiştirmeli İnce Ayar (RFT)
Amazon Nova modelleri için pekiştirmeli ince ayar (RFT) rehberi yayınlandı. Denetimli ince ayardan farkı, ödül fonksiyonu tasarımı ve Nova Forge ile çok turlu ajantik iş akışları ele alınıyor.
*Kaynak: [AWS Machine Learning](https://aws.amazon.com/blogs/machine-learning/reinforcement-fine-tuning-for-amazon-nova-teaching-ai-through-feedback/)*

---

## 📦 Açık Kaynak Hazineleri

### Çoklu Ajan İş Akışları — Başarısızlığı Önlemenin 3 Mühendislik Kalıbı
GitHub'ın mühendislik blogu, çoklu ajan iş akışlarındaki başarısızlıkların model kapasitesinden değil, eksik yapılandırmadan kaynaklandığını gösteriyor. Üç güvenilirlik kalıbı detaylıca anlatılıyor.
*Kaynak: [GitHub Blog](https://github.blog/ai-and-ml/generative-ai/multi-agent-workflows-often-fail-heres-how-to-engineer-ones-that-dont/)*

### Steerling-8B — Yorumlanabilir Açık Kaynak LLM
Guide Labs'ın 8B parametreli modeli. Her belirtecin eğitim verisine geri izlenebilmesi, güvenlik ve uyum gereksinimleri olan projeler için değerli.
*Kaynak: [TechCrunch](https://techcrunch.com/2026/02/23/guide-labs-debuts-a-new-kind-of-interpretable-llm/)*

### Anthropic — Açık Kaynak Geliştiricilere Ücretsiz Claude Max
Anthropic, 5.000+ GitHub yıldızı veya 1M+ aylık NPM indirmesi olan açık kaynak proje bakımcılarına 6 ay boyunca ücretsiz Claude Max (200$/ay değerinde) sunuyor. 10.000 kişilik kontenjan var.
*Kaynak: [Simon Willison's Blog](https://simonwillison.net/2026/Feb/27/claude-max-oss-six-months/#atom-everything)*

---

## ⚡ Hızlı Başlangıç: Denemeye Değer

### Cursor Bulut Ajanları
```bash
# cursor.com/onboard adresinden başlayın
# Ajan kendini yapılandırıp bir demo kaydedecek
# Web, masaüstü, mobil, Slack veya GitHub Issues üzerinden başlatılabilir
```

### GitHub Copilot CLI
```bash
gh extension install github/gh-copilot
gh copilot suggest "refactor this function to use async/await"
gh copilot explain "git rebase --onto main feature"
```

### VS Code Şubat 2026 (v1.110)
```bash
# Uzun mesafeli düzenleme önerileri otomatik olarak aktif
code-insiders --install-extension GitHub.copilot
```

### Claude Max — Açık Kaynak Geliştiriciler İçin
```
# Başvuru: claude.com/contact-sales/claude-for-oss
# Kriterler: 5K+ GitHub yıldızı VEYA 1M+ aylık NPM indirmesi
# 6 ay ücretsiz Claude Max 20x planı
```

---

## 🔗 Tüm Kaynaklar

| # | Başlık | Kaynak |
|---|--------|--------|
| 1 | Cursor Bulut Ajanları — Bilgisayar Kullanımı | [Cursor](https://forum.cursor.com/t/cloud-agents-with-computer-use/152829) |
| 2 | GPT-5.3-Codex GitHub'da Kullanıma Açıldı | [GitHub Changelog](https://github.blog/changelog/2026-02-25-gpt-5-3-codex-is-now-available-in-github-com-github-mobile-and-visual-studio) |
| 3 | Claude Cowork Kurumsal Yetenekler (Spotify Örneği) | [VentureBeat](https://venturebeat.com/orchestration/anthropic-says-claude-code-transformed-programming-now-claude-cowork-is) |
| 4 | Guide Labs Steerling-8B | [TechCrunch](https://techcrunch.com/2026/02/23/guide-labs-debuts-a-new-kind-of-interpretable-llm/) |
| 5 | Figma + OpenAI Codex (MCP) | [TechCrunch](https://techcrunch.com/2026/02/26/figma-partners-with-openai-to-bake-in-support-for-codex/) |
| 6 | GitHub Copilot Kodlama Ajanı Güncellemeleri | [GitHub Blog](https://github.blog/ai-and-ml/github-copilot/whats-new-with-github-copilot-coding-agent/) |
| 7 | VS Code Uzun Mesafeli Düzenleme Önerileri | [VS Code Blog](https://code.visualstudio.com/blogs/2026/02/26/long-distance-nes) |
| 8 | GitHub Copilot CLI Rehberi | [GitHub Blog](https://github.blog/ai-and-ml/github-copilot/from-idea-to-pull-request-a-practical-guide-to-building-with-github-copilot-cli/) |
| 9 | Çoklu Ajan İş Akışları Kalıpları | [GitHub Blog](https://github.blog/ai-and-ml/generative-ai/multi-agent-workflows-often-fail-heres-how-to-engineer-ones-that-dont/) |
| 10 | Claude & Codex → Copilot Business/Pro | [GitHub Changelog](https://github.blog/changelog/2026-02-26-claude-and-codex-now-available-for-copilot-business-pro-users) |
| 11 | HuggingFace MoE Transformers Rehberi | [HuggingFace](https://huggingface.co/blog/moe-transformers) |
| 12 | OpenAI SWE-bench Pro Önerisi | [OpenAI](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified) |
| 13 | Kodlama Ajanlarıyla Skeptik Deneyimi | [Simon Willison](https://simonwillison.net/2026/Feb/27/ai-agent-coding-in-excessive-detail/#atom-everything) |
| 14 | Açık Kaynak İçin Ücretsiz Claude Max | [Anthropic](https://claude.com/contact-sales/claude-for-oss) |
| 15 | AWS vLLM Çoklu LoRA Çıkarımı | [AWS](https://aws.amazon.com/blogs/machine-learning/efficiently-serve-dozens-of-fine-tuned-models-with-vllm-on-amazon-sagemaker-ai-and-amazon-bedrock/) |

---
*Bu bülten, ai-haber-bulteni-mcp tarafından 102 haber kaynağından (Tavily: 10, RSS: 92) derlenerek oluşturulmuştur.*
