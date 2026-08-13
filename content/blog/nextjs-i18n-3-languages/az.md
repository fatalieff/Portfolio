---
title: "3 dildə portfolio: Next.js-də i18n"
date: 2026-08-05
excerpt: "Next.js App Router-da çoxdilli sayt qurmaq — locale marşrutları, middleware ilə cookie əsaslı yönləndirmə və tip təhlükəsiz dictionary-lar."
tags: [Next.js, i18n, Architecture]
---

Bu saytın özü üç dildə işləyir: azərbaycanca, ingiliscə və rusca. Yığılmış təcrübəni qeyd edirəm — kiməsə faydalı olar.

## Struktur: [lang] marşrut parametri

Hər şey `app/[lang]/` qovluğundan asılıdır. Hər dil üçün eyni komponent işləyir, yalnız mətnlər dəyişir. `generateStaticParams` sayəsində hər üç dil build zamanı statik HTML kimi hazırlanır — sürət və SEO qazanırıq.

## Yönləndirmə: middleware

İstifadəçi `/` açanda middleware cookie-ə baxır, cookie yoxdursa `Accept-Language` header-ına baxıb uyğun dilə yönləndirir. `proxy.ts` faylı ilə bu logika mərkəzləşdirilib:

- cookie varsa → ondan istifadə
- cookie yoxdursa → Accept-Language
- heç biri yoxdursa → ingiliscə

## Dictionary-lar və tip təhlükəsizliyi

Hər dilin mətnləri ayrı JSON faylındadır. JSON import edilən kimi TypeScript onun tipini avtomatik çıxarır — yəni bir dildə açar unudulsa, tip səhvi dərhal xəbər verir. Bu, çoxdilli layihələrin ən böyük problemlərindən birini — "açar qaçdı, tərcümə əskik qaldı" problemini — kökündən həll edir.

## Dərslər

Ən vacib dərs: mətnləri komponentlərin içində sərt kodla yazma — həmişə dictionary-ya köçür. Bir dəfə başlayanda geri dönmək çətindir.
