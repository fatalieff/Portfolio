import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import TopNav from "@/components/TopNav";
import { getDictionary } from "@/lib/dictionaries";
import { getPost, listPostSlugs, formatDate } from "@/lib/blog";
import { isLocale, locales } from "@/lib/i18n-config";

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return listPostSlugs().flatMap((slug) =>
    locales.map((lang) => ({ lang, slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const post = getPost(slug, lang);
  const dict = getDictionary(lang);
  if (!post) return { title: dict.blog.title };
  return {
    title: `${post.title} · ${dict.metadata.title}`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const post = getPost(slug, lang);
  if (!post) notFound();

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden text-foreground">
      <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="mesh-bg opacity-80" />
        <div className="dot-grid" />
      </div>

      <div className="relative z-10">
        <TopNav />

        <article className="relative px-6 pb-32 pt-28 sm:px-10">
          <div className="mx-auto max-w-3xl">
            <Link
              href={`/${lang}/blog`}
              className="inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              {dict.blog.backToPosts}
            </Link>

            <header className="mt-10">
              <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
                <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-black/[0.04] px-2.5 py-1 tracking-wide">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="mt-5 font-heading text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl md:text-[2.75rem]">
                {post.title}
              </h1>
            </header>

            <div className="mt-12 rounded-3xl border border-black/[0.06] bg-white/70 p-7 shadow-[0_8px_30px_rgb(15,23,42,0.04)] sm:p-10">
              <div
                className="blog-prose text-[15px] leading-[1.8] text-foreground/85 md:text-[16.5px]"
                dangerouslySetInnerHTML={{ __html: post.html }}
              />
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
