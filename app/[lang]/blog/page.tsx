import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import TopNav from "@/components/TopNav";
import { getDictionary } from "@/lib/dictionaries";
import { getPosts, formatDate } from "@/lib/blog";
import { isLocale } from "@/lib/i18n-config";

type Props = { params: Promise<{ lang: string }> };

export default async function BlogPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const posts = getPosts(lang);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden text-foreground">
      <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="mesh-bg opacity-80" />
        <div className="dot-grid" />
      </div>

      <div className="relative z-10">
        <TopNav />

        <section className="relative px-6 pb-32 pt-28 sm:px-10">
          <div className="mx-auto max-w-4xl">
            <Reveal variant="fade">
              <Link
                href={`/${lang}`}
                className="inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" />
                {dict.hero.name}
              </Link>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-8 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {dict.blog.title}
                <span className="text-accent">.</span>
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-4 text-[15px] leading-relaxed text-foreground/70 md:text-[16px]">
                {dict.blog.subtitle}
              </p>
            </Reveal>

            <div className="mt-14 space-y-6">
              {posts.map((post, index) => (
                <Reveal key={post.slug} delay={index * 60}>
                  <Link
                    href={`/${lang}/blog/${post.slug}`}
                    className="group block rounded-3xl border border-black/[0.05] bg-white/60 p-7 transition-all duration-300 hover:border-accent/30 hover:bg-white/80 hover:shadow-[0_24px_50px_-28px_rgb(79,70,229,0.3)] sm:p-8"
                  >
                    <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
                      <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
                      {post.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-black/[0.04] px-2.5 py-1 tracking-wide text-muted-foreground transition-colors group-hover:bg-accent/5">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-[14px] leading-[1.7] text-foreground/70">
                      {post.excerpt}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent">
                      {dict.blog.readMore}
                      <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
