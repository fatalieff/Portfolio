---
title: "How I built an AI assistant into my portfolio"
date: 2026-08-12
excerpt: "Adding a 3-language AI chat to a portfolio site with the Groq API and Llama — system prompts, context building, and a local fallback strategy."
tags: [AI, Next.js, Groq]
---

I wanted to add an AI assistant to my portfolio that answers visitor questions. The goal was simple: a user asking about React, Next.js, or how to contact me should get a correct answer within seconds.

## The choice: Groq + Llama

I picked Groq because it's fast, exposes a straightforward OpenAI-compatible endpoint, and the `llama-3.3-70b-versatile` model produces good-quality answers. No extra SDK needed — a plain `fetch` POST is enough.

## Per-locale system prompts

The key detail is building the system prompt per language. Since the site works in 3 languages, I pull context from each language's dictionary: name, role, location, about text, skills, projects, email, and social links. The prompt header also enforces the language rule:

```
Cavabları həmişə Azərbaycan dilində yaz.
```

This way the model never answers in the wrong language.

## Fallback strategy

The site must keep working even when the AI service is unavailable. That's why the request goes to the API first, and on error a set of local canned answers kicks in — the visitor still gets a reply without noticing anything wrong.

## Result

A few hours of work made the site feel much more alive. The biggest lesson: always design the "offline" path when adding AI features — API errors should never ruin the user experience.
