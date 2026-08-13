---
title: "Portfolioda AI köməkçisi necə qurdum"
date: 2026-08-12
excerpt: "Groq API və Llama modeli ilə portfolio saytına 3 dildə cavab verən AI çat əlavə etmək — sistem promptu, kontekst və fallback strategiyası."
tags: [AI, Next.js, Groq]
---

Portfolio saytıma gələn ziyarətçilər üçün suallara cavab verən AI köməkçisi əlavə etmək istəyirdim. Məqsəd sadə idi: React, Next.js və əlaqə haqqında soruşan istifadəçi bir neçə saniyə ərzində düzgün cavab alsın.

## Seçim: Groq + Llama

API seçimində Groq-a üstünlük verdim — sürətlidir, sadə OpenAI-uyğun endpoint təqdim edir və `llama-3.3-70b-versatile` modeli kifayət qədər keyfiyyətli cavablar verir. Əlavə SDK tələb olunmur: sadəcə `fetch` ilə POST sorğusu göndərmək kifayətdir.

## Sistem promptu — dilə görə kontekst

Əsas detal sistem promptunun hər dil üçün ayrı qurulmasıdır. Sayt 3 dildə işlədiyi üçün hər dilin dictionary-sindən kontekst çıxarıram: ad, rol, lokasiya, haqqında mətn, bacarıqlar, layihələr, email və sosial linklər. Prompt başlığında da dil qaydası göstərilir:

```
Cavabları həmişə Azərbaycan dilində yaz.
```

Beləliklə model heç vaxt yanlış dildə cavab vermir.

## Fallback strategiyası

AI xidməti əlçatan olmasa da sayt işlək qalmalıdır. Bu səbəbdən əvvəlcə API-yə müraciət edirəm, xəta halında lokal hazır cavablar işə düşür — istifadəçi heç bir fərq hiss etmədən cavab alır.

## Nəticə

Bir neçə saatlıq iş saytı daha canlı etdi. Ən böyük dərs: AI funksiyasını əlavə edərkən həmişə "offline" halını düşünmək lazımdır — API xətaları istifadəçi təcrübəsini pozmamalıdır.
