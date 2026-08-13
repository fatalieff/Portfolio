import { readFileSync, readdirSync } from "fs";
import path from "path";
import { marked } from "marked";
import type { Locale } from "./i18n-config";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  html: string;
};

export function formatDate(date: string, locale: Locale): string {
  try {
    return new Date(date).toLocaleDateString(
      locale === "az" ? "az-AZ" : locale === "ru" ? "ru-RU" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
  } catch {
    return date;
  }
}

type Frontmatter = {
  title?: string;
  date?: string;
  excerpt?: string;
  tags?: string;
};

function parseFrontmatter(raw: string): { meta: Frontmatter; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { meta: {}, body: raw };
  const meta: Frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^(\w+):\s*(.*)$/.exec(line);
    if (kv) meta[kv[1] as keyof Frontmatter] = kv[2].trim();
  }
  return { meta, body: match[2] };
}

export function listPostSlugs(): string[] {
  return readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

export function getPost(slug: string, locale: Locale): BlogPost | null {
  try {
    const raw = readFileSync(path.join(CONTENT_DIR, slug, `${locale}.md`), "utf8");
    const { meta, body } = parseFrontmatter(raw);
    return {
      slug,
      title: meta.title ?? slug,
      date: meta.date ?? "",
      excerpt: meta.excerpt ?? "",
      tags: (meta.tags ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      html: marked.parse(body) as string,
    };
  } catch {
    return null;
  }
}

export function getPosts(locale: Locale): BlogPost[] {
  return listPostSlugs()
    .map((slug) => getPost(slug, locale))
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
