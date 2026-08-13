---
title: "A 3-language portfolio: i18n in Next.js"
date: 2026-08-05
excerpt: "Building a multilingual site with the Next.js App Router — locale routes, cookie-based redirects in middleware, and type-safe dictionaries."
tags: [Next.js, i18n, Architecture]
---

This site itself works in three languages: Azerbaijani, English, and Russian. Writing down what I learned in case it helps someone else.

## Structure: the [lang] route param

Everything hangs off the `app/[lang]/` folder. The same component runs for every language — only the texts change. Thanks to `generateStaticParams`, all three languages are prerendered as static HTML at build time, which helps speed and SEO.

## Redirects: middleware

When a visitor opens `/`, the middleware checks the locale cookie first, falls back to the `Accept-Language` header, and redirects to the matching locale. The logic lives in the `proxy.ts` file:

- cookie set → use it
- no cookie → Accept-Language header
- neither → English

## Dictionaries and type safety

Every language's texts live in a separate JSON file. Since the JSON is imported directly, TypeScript infers its shape automatically — forget a key in one language and the type error appears immediately. That solves the biggest problem of multilingual projects ("a key was missed, a translation went stale") at the root.

## Lessons

The most important lesson: never hardcode UI strings inside components — always move them to the dictionary. Once you start, it's hard to go back.
