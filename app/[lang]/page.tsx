import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  ChevronDown,
  GitFork,
  Mail,
  Sparkles,
  Star,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import Scroll3D from "@/components/Scroll3D";
import ThreeScene from "@/components/ThreeScene";
import TopNav from "@/components/TopNav";
import Assistant from "@/components/Assistant";
import ScrollLink from "@/components/ScrollLink";
import ContactForm from "@/components/ContactForm";
import Faq from "@/components/Faq";
import TypedName from "@/components/TypedName";
import SplitReveal from "@/components/SplitReveal";
import HeroParallax from "@/components/HeroParallax";
import SpotlightCard from "@/components/SpotlightCard";
import Magnetic from "@/components/Magnetic";
import Counter from "@/components/Counter";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n-config";
import { fetchRepos, FALLBACK_REPOS } from "@/lib/github";

type Props = PageProps<"/[lang]">;

const eyebrow = (label: string) => (
  <p className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground/70">
    {label}
  </p>
);

const SectionHeading = ({
  label,
  className,
  plain = false,
}: {
  label: string;
  className?: string;
  plain?: boolean;
}) => (
  <Scroll3D className="mt-4" maxTilt={12}>
    <h2
      className={`mt-4 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl ${className ?? ""}`}
    >
      {plain ? label : <SplitReveal text={label} />}
    </h2>
  </Scroll3D>
);

export default async function Home({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const featured = dict.projects.featured;
  const projectItems = dict.projects.items;
  const allProjects = [featured, ...projectItems];
  const liveRepos = await fetchRepos();
  const repos =
    liveRepos.length > 0
      ? liveRepos
      : FALLBACK_REPOS.map((repo) => {
          const project = allProjects.find((p) =>
            p.github.toLowerCase().endsWith(`/${repo.name.toLowerCase()}`)
          );
          return project ? { ...repo, description: project.description } : repo;
        });

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden text-foreground">
      <div
        className="fixed inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="mesh-bg opacity-80" />
        <div className="dot-grid" />
        <ThreeScene className="absolute inset-0" />
      </div>

      <div className="relative z-10">
      <TopNav />

      <section
        id="hero"
        className="relative flex min-h-[100dvh] w-full items-center overflow-hidden"
      >
        <HeroParallax className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-24 pt-28 sm:px-10">
          <div className="flex w-full flex-col items-start text-left">
            <Reveal delay={100}>
              <h1 className="font-heading text-5xl font-semibold leading-[1.02] tracking-tight text-foreground sm:text-6xl md:text-[4.75rem]">
                <TypedName text={dict.hero.name} />
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-5 text-lg font-medium leading-snug text-muted-foreground sm:text-xl">
                {dict.hero.role}{" "}
                <span className="mx-2 text-black/15">{dict.hero.divider}</span>{" "}
                {dict.hero.focus}
              </p>
            </Reveal>
          </div>
          <Reveal delay={300}>
            <Assistant />
          </Reveal>
        </HeroParallax>
        <ScrollLink
          target="about"
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground/60 transition-colors hover:text-foreground"
        >
          {dict.scroll}
          <span>
            <ChevronDown className="size-4 opacity-50" />
          </span>
        </ScrollLink>
      </section>

      <section
        id="about"
        className="relative scroll-mt-24 border-t border-black/[0.05] px-6 py-24 sm:px-10 md:py-32"
      >
        <div className="mx-auto max-w-4xl">
          <Reveal variant="fade">{eyebrow(dict.about.eyebrow)}</Reveal>
          <SectionHeading label={dict.about.title} />
          <Reveal className="mt-12" delay={100}>
            <div className="rounded-3xl border border-black/[0.06] bg-white/70 p-7 shadow-[0_8px_30px_rgb(15,23,42,0.04)] sm:p-10">
              <p className="whitespace-pre-line text-[15px] font-normal leading-[1.8] text-foreground/85 md:text-[17px]">
                {dict.about.body}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id="projects"
        className="relative scroll-mt-24 border-t border-black/[0.05] px-6 py-24 sm:px-10 md:py-32"
      >
        <div className="mx-auto max-w-5xl">
          <Reveal variant="fade">{eyebrow(dict.projects.eyebrow)}</Reveal>
          <SectionHeading label={dict.projects.title} />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <Reveal className="md:col-span-2">
              <Scroll3D maxTilt={6} hoverTilt={4} depth={24}>
                <SpotlightCard>
                <article className="group relative h-full overflow-hidden rounded-3xl border border-black/[0.05] bg-white/60 p-7 transition-all duration-300 hover:border-accent/30 hover:shadow-[0_30px_60px_-30px_rgb(79,70,229,0.35)] sm:p-9">
                <div
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent via-[#8b5cf6] to-[#22d3ee]"
                  aria-hidden="true"
                />
                <span className="mb-5 inline-flex rounded-full bg-accent/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-accent">
                  {dict.projects.featuredBadge}
                </span>
                <h3 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {featured.title}
                </h3>
                <p className="mt-3 max-w-2xl text-[15px] leading-[1.8] text-foreground/75 md:text-[16px]">
                  {featured.description}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-2">
                  {featured.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium tracking-wide text-foreground/60 transition-colors group-hover:bg-accent/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <a
                    href={featured.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent transition-colors hover:text-accent/80"
                  >
                    {dict.projects.liveDemo}
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  <Link
                    href={`/${lang}/projects/${featured.slug}`}
                    className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-foreground/70 transition-colors hover:text-accent"
                  >
                    {dict.projects.details}
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
                </article>
                </SpotlightCard>
              </Scroll3D>
            </Reveal>
            {projectItems.map((project, index) => (
              <Reveal key={project.title} delay={(index % 2) * 80}>
                <Scroll3D maxTilt={8} hoverTilt={6} depth={32}>
                  <SpotlightCard>
                  <article className="group flex h-full flex-col rounded-3xl border border-black/[0.05] bg-white/50 p-7 transition-all duration-300 hover:border-accent/25 hover:bg-white/80 hover:shadow-[0_24px_50px_-28px_rgb(79,70,229,0.3)]">
                  <h3 className="font-heading text-[1.25rem] font-semibold tracking-tight text-foreground">
                    {project.title}
                  </h3>
                  <p className="mt-3 flex-1 line-clamp-3 text-[14px] leading-[1.7] text-foreground/70">
                    {project.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[11px] font-medium tracking-wide text-muted-foreground transition-colors group-hover:bg-accent/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent transition-colors hover:text-accent/80"
                    >
                      {dict.projects.liveDemo}
                      <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                    <Link
                      href={`/${lang}/projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-foreground/70 transition-colors hover:text-accent"
                    >
                      {dict.projects.details}
                      <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </article>
                  </SpotlightCard>
                </Scroll3D>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        id="github"
        className="relative scroll-mt-24 border-t border-black/[0.05] px-6 py-24 sm:px-10 md:py-32"
      >
        <div className="mx-auto max-w-4xl">
          <Reveal variant="fade">{eyebrow(dict.github.eyebrow)}</Reveal>
          <SectionHeading label={dict.github.title} />
          <Reveal className="mt-6" delay={80}>
            <p className="text-[14px] leading-relaxed text-foreground/70">
              {dict.github.subtitle}
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {repos.map((repo, index) => (
              <Reveal key={repo.fullName} delay={index * 80}>
                <SpotlightCard>
                <a
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-full rounded-3xl border border-black/[0.05] bg-white/60 p-7 transition-all duration-300 hover:border-accent/30 hover:bg-white/80 hover:shadow-[0_24px_50px_-28px_rgb(79,70,229,0.3)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="flex items-center gap-2 truncate font-heading text-lg font-semibold tracking-tight text-foreground">
                        <GithubIcon className="size-4 shrink-0 opacity-70" />
                        {repo.name}
                      </h3>
                      <p className="mt-1 truncate font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground/70">
                        {repo.fullName}
                      </p>
                    </div>
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground/50 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                  </div>
                  {repo.description && (
                    <p className="mt-4 line-clamp-2 text-[13.5px] leading-[1.7] text-foreground/70">
                      {repo.description}
                    </p>
                  )}
                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-muted-foreground">
                    {repo.language && (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-accent/70" />
                        {repo.language}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                      <Star className="size-3.5" />
                      <Counter to={repo.stars} /> {dict.github.stars}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <GitFork className="size-3.5" />
                      <Counter to={repo.forks} /> {dict.github.forks}
                    </span>
                  </div>
                  {repo.updatedAt !== "" && (
                    <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground/60">
                      {dict.github.updated}:{" "}
                      {new Date(repo.updatedAt).toLocaleDateString(lang)}
                    </p>
                  )}
                </a>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        id="skills"
        className="relative scroll-mt-24 border-t border-black/[0.05] px-6 py-24 sm:px-10 md:py-32"
      >
        <div className="mx-auto max-w-5xl">
          <Reveal variant="fade">{eyebrow(dict.skills.eyebrow)}</Reveal>
          <SectionHeading label={dict.skills.title} />
          <Reveal className="mt-14" delay={100}>
            <div className="flex flex-col gap-14 md:flex-row md:items-start md:gap-20">
              {dict.skills.groups.map((group) => (
                <Scroll3D
                  key={group.label}
                  className="min-w-0 flex-1"
                  maxTilt={14}
                  depth={50}
                  hoverTilt={4}
                >
                  <div className="min-w-0 flex-1">
                  <h3 className="mb-8 flex items-center gap-4 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                    {group.label}
                    <span className="h-px flex-1 bg-black/[0.08]" aria-hidden="true" />
                  </h3>
                  <ul className="space-y-5">
                    {group.rows.map((row) => (
                      <li
                        key={row.label}
                        className="border-b border-dashed border-black/[0.1] pb-5 last:border-0 last:pb-0"
                      >
                        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-x-4">
                          <span className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/90 sm:w-[11rem]">
                            {row.label}
                          </span>
                          <p className="min-w-0 flex-1 text-[15px] font-medium leading-relaxed text-foreground/85">
                            {row.value}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-9">
                    <h4 className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">
                      {dict.skills.levelsTitle}
                    </h4>
                    <ul className="mt-5 space-y-4">
                      {group.levels.map((skill) => (
                        <li key={skill.name}>
                          <div className="mb-1.5 flex items-baseline justify-between gap-3">
                            <span className="text-[13.5px] font-medium text-foreground/85">
                              {skill.name}
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
                              {dict.skills.levelLabels[
                                String(skill.level) as keyof typeof dict.skills.levelLabels
                              ]}
                            </span>
                          </div>
                          <div
                            className="h-1.5 overflow-hidden rounded-full bg-black/[0.06]"
                            role="progressbar"
                            aria-valuenow={skill.level * 20}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-accent via-[#8b5cf6] to-[#22d3ee] transition-all duration-700"
                              style={{ width: `${skill.level * 20}%` }}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  </div>
                </Scroll3D>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id="focus"
        className="relative scroll-mt-24 border-t border-black/[0.05] px-6 py-24 sm:px-10 md:py-32"
      >
        <div className="mx-auto max-w-4xl">
          <Reveal variant="fade">{eyebrow(dict.focus.eyebrow)}</Reveal>
          <SectionHeading label={dict.focus.title} />
          <Reveal className="mt-12" delay={100}>
            <div className="relative overflow-hidden rounded-3xl border border-black/[0.06] bg-white/70 p-7 shadow-[0_8px_30px_rgb(15,23,42,0.04)] sm:p-10">
              <div
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent via-[#8b5cf6] to-[#22d3ee]"
                aria-hidden="true"
              />
              <p className="text-[15px] leading-[1.8] text-foreground/85 md:text-[17px]">
                {dict.focus.pitch}
              </p>
              <p className="mt-6 border-l-2 border-accent/30 pl-4 text-[15px] italic leading-relaxed text-muted-foreground">
                &quot;{dict.focus.quote}&quot;
              </p>
              <h3 className="mt-10 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                {dict.focus.workTitle}
              </h3>
              <ul className="mt-4 space-y-3">
                {dict.focus.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-[14px] leading-relaxed text-foreground/75"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent/60" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
                  {dict.focus.openForLabel}
                </span>
                {dict.focus.openFor.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-black/[0.08] bg-white/70 px-3 py-1 text-[12px] font-medium text-foreground/70"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <Magnetic className="inline-block">
              <ScrollLink
                target="hero"
                className="mt-10 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-semibold text-background transition-opacity hover:opacity-85"
              >
                <Sparkles className="size-4" />
                {dict.focus.backToChat}
              </ScrollLink>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id="faq"
        className="relative scroll-mt-24 border-t border-black/[0.05] px-6 py-24 sm:px-10 md:py-32"
      >
        <div className="mx-auto max-w-4xl">
          <Reveal variant="fade">{eyebrow(dict.faq.eyebrow)}</Reveal>
          <SectionHeading label={dict.faq.title} />
          <Faq />
        </div>
      </section>

      <section
        id="contact"
        className="relative scroll-mt-24 border-t border-black/[0.05] px-6 py-24 pb-32 sm:px-10 md:py-32 md:pb-48"
      >
        <div className="mx-auto max-w-2xl text-center">
          <Reveal variant="fade">{eyebrow(dict.contact.eyebrow)}</Reveal>
          <SectionHeading label={dict.contact.title} className="shimmer-text" plain />
          <Reveal className="mt-10" delay={80}>
            <p className="text-[15px] leading-relaxed text-foreground/70">
              {dict.contact.intro}
            </p>
          </Reveal>
          <Reveal delay={140}>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-[14px] text-muted-foreground/80">
              <span>{dict.contact.location}</span>
              <span aria-hidden="true">·</span>
              <a
                href={`mailto:${dict.contact.email}`}
                className="text-foreground/75 underline-offset-2 transition-colors hover:text-accent hover:underline"
              >
                {dict.contact.email}
              </a>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <ContactForm />
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-10 flex flex-col items-center gap-8">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Magnetic>
                <a
                  href={`mailto:${dict.contact.email}`}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30"
                >
                  <Mail className="size-4" />
                  {dict.contact.getInTouch}
                </a>
                </Magnetic>
                <Magnetic>
                <a
                  href="https://github.com/fatalieff"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-6 py-3 text-sm font-medium text-foreground transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                >
                  <GithubIcon className="size-4 opacity-70" />
                  {dict.contact.github}
                </a>
                </Magnetic>
              </div>
              <div className="flex items-center justify-center gap-6">
                <a
                  href="https://www.linkedin.com/in/mourad-fatalief"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="group flex size-12 items-center justify-center rounded-full border border-black/8 bg-white/60 text-muted-foreground transition-all duration-300 hover:scale-105 hover:border-accent hover:bg-accent hover:text-white"
                >
                  <LinkedinIcon className="size-5 transition-transform duration-300 group-hover:scale-110" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      </div>
    </main>
  );
}
