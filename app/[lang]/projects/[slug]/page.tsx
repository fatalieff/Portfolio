import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import TopNav from "@/components/TopNav";
import { GithubIcon } from "@/components/icons";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, locales } from "@/lib/i18n-config";

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((lang) => [
    { lang, slug: "gala-garden-cinema" },
    { lang, slug: "hell-var" },
    { lang, slug: "foodie" },
  ]);
}

function findProject(dict: ReturnType<typeof getDictionary>, slug: string) {
  const all = [dict.projects.featured, ...dict.projects.items];
  return all.find((project) => project.slug === slug) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  const project = findProject(dict, slug);
  if (!project) return { title: dict.metadata.title };
  return {
    title: `${project.title} · ${dict.metadata.title}`,
    description: project.longDescription,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const project = findProject(dict, slug);
  if (!project) notFound();

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden text-foreground">
      <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="mesh-bg opacity-80" />
        <div className="dot-grid" />
      </div>

      <div className="relative z-10">
        <TopNav />

        <article className="relative px-6 pb-32 pt-28 sm:px-10">
          <div className="mx-auto max-w-4xl">
            <Reveal variant="fade">
              <Link
                href={`/${lang}#projects`}
                className="inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" />
                {dict.projects.backToProjects}
              </Link>
            </Reveal>

            <header className="mt-10">
              <Reveal delay={80}>
                <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground/80">
                  <span>{dict.projects.yearLabel}: {project.year}</span>
                  <span aria-hidden="true">·</span>
                  <span>{dict.projects.roleLabel}: {project.role}</span>
                </div>
              </Reveal>
              <Reveal delay={140}>
                <h1 className="mt-5 font-heading text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
                  {project.title}
                  <span className="text-accent">.</span>
                </h1>
              </Reveal>
            </header>

            <Reveal className="mt-12" delay={100}>
              <div className="rounded-3xl border border-black/[0.06] bg-white/70 p-7 shadow-[0_8px_30px_rgb(15,23,42,0.04)] sm:p-10">
                <p className="text-[15px] leading-[1.8] text-foreground/85 md:text-[17px]">
                  {project.longDescription}
                </p>

                <div className="mt-9 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-black/[0.04] px-3 py-1 text-[12px] font-medium tracking-wide text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <h2 className="mt-10 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                  {dict.projects.featuresTitle}
                </h2>
                <ul className="mt-4 space-y-3">
                  {project.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-3 text-[14px] leading-relaxed text-foreground/75"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30"
                  >
                    {dict.projects.liveDemo}
                    <ArrowUpRight className="size-4" />
                  </a>
                  {project.github !== "" && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-6 py-3 text-sm font-medium text-foreground transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                    >
                      <GithubIcon className="size-4 opacity-70" />
                      {dict.projects.sourceCode}
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </article>
      </div>
    </main>
  );
}
