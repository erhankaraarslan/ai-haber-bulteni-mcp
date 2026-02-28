import type { RssSource, Persona } from "../types/index.js";

export const RSS_SOURCES: RssSource[] = [
  // ── C-LEVEL ──────────────────────────────────────────────────────────────
  {
    name: "TechCrunch AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    persona: ["c_level", "product_manager"],
    language: "en",
  },
  {
    name: "VentureBeat AI",
    url: "https://venturebeat.com/category/ai/feed/",
    persona: ["c_level"],
    language: "en",
  },
  {
    name: "MIT Technology Review",
    url: "https://www.technologyreview.com/feed/",
    persona: ["c_level", "developer"],
    language: "en",
  },
  {
    name: "AI Business",
    url: "https://aibusiness.com/rss.xml",
    persona: ["c_level"],
    language: "en",
  },
  {
    name: "NVIDIA AI Blog",
    url: "https://blogs.nvidia.com/feed/",
    persona: ["c_level", "developer"],
    language: "en",
  },
  {
    name: "Microsoft AI Blog",
    url: "https://blogs.microsoft.com/ai/feed/",
    persona: ["c_level", "product_manager"],
    language: "en",
  },
  {
    name: "Wired AI",
    url: "https://www.wired.com/feed/tag/ai/latest/rss",
    persona: ["c_level", "product_manager"],
    language: "en",
  },

  // ── PRODUCT MANAGER ───────────────────────────────────────────────────────
  {
    name: "OpenAI News",
    url: "https://openai.com/news/rss.xml",
    persona: ["product_manager", "developer"],
    language: "en",
  },
  {
    name: "Anthropic News",
    url: "https://openrss.org/feed/www.anthropic.com/news",
    persona: ["product_manager", "developer"],
    language: "en",
  },
  {
    name: "Google AI Blog",
    url: "https://blog.google/technology/ai/rss/",
    persona: ["product_manager", "c_level"],
    language: "en",
  },
  {
    name: "The Verge AI",
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    persona: ["product_manager"],
    language: "en",
  },
  {
    name: "AWS Machine Learning",
    url: "https://aws.amazon.com/blogs/machine-learning/feed/",
    persona: ["product_manager", "developer", "c_level"],
    language: "en",
  },

  // ── DEVELOPER ─────────────────────────────────────────────────────────────
  {
    name: "HuggingFace Blog",
    url: "https://huggingface.co/blog/feed.xml",
    persona: ["developer"],
    language: "en",
  },
  {
    name: "Simon Willison's Blog",
    url: "https://simonwillison.net/atom/everything/",
    persona: ["developer"],
    language: "en",
  },
  {
    name: "MarkTechPost",
    url: "https://www.marktechpost.com/feed/",
    persona: ["developer"],
    language: "en",
  },
  {
    name: "Ars Technica",
    url: "https://feeds.arstechnica.com/arstechnica/technology-lab",
    persona: ["developer"],
    language: "en",
  },
  {
    name: "Towards Data Science",
    url: "https://towardsdatascience.com/feed",
    persona: ["developer"],
    language: "en",
  },
  {
    name: "Latent Space",
    url: "https://www.latent.space/feed",
    persona: ["developer"],
    language: "en",
  },

  // ── AI CODING TOOLS (IDE & Copilot) ───────────────────────────────────────
  {
    name: "GitHub Blog",
    url: "https://github.blog/feed/",
    persona: ["developer", "product_manager", "copilot_user"],
    language: "en",
  },
  {
    name: "GitHub Copilot Changelog",
    url: "https://github.blog/changelog/label/copilot/feed/",
    persona: ["developer", "copilot_user"],
    language: "en",
  },
  {
    name: "VS Code Blog",
    url: "https://code.visualstudio.com/feed.xml",
    persona: ["developer", "copilot_user"],
    language: "en",
  },
  {
    name: "Cursor Announcements",
    url: "https://forum.cursor.com/c/announcements/11.rss",
    persona: ["developer"],
    language: "en",
  },
  {
    name: "Windsurf (Codeium) Blog",
    url: "https://windsurf.com/feed.xml",
    persona: ["developer"],
    language: "en",
  },

  // ── COPILOT USER (VS Code + GitHub Copilot) ──────────────────────────────
  {
    name: "GitHub Changelog",
    url: "https://github.blog/changelog/feed/",
    persona: ["copilot_user"],
    language: "en",
  },
  {
    name: "VS Code DevBlogs",
    url: "https://devblogs.microsoft.com/vscode-blog/feed/",
    persona: ["copilot_user"],
    language: "en",
  },
  {
    name: "Ken Muse Blog",
    url: "https://www.kenmuse.com/feed/",
    persona: ["copilot_user"],
    language: "en",
  },
  {
    name: "GitHub AI/ML Blog",
    url: "https://github.blog/ai-and-ml/feed/",
    persona: ["copilot_user"],
    language: "en",
  },
];

export function getSourcesForPersona(persona: Persona): RssSource[] {
  return RSS_SOURCES.filter((s) => s.persona.includes(persona));
}
