---
title: "Niyə Virtual DOM yaranıb?"
date: 2026-08-13
excerpt: "jQuery dövründən React Fiber-ə qədər — real DOM-un ağırlığı, diff/reconciliation və Virtual DOM-un niyə ortaya çıxdığının qısa izahı."
tags: [Virtual DOM, React, Performance]
---

Bu məqalə Virtual DOM-un yaranma səbəbləri və brauzerin məzmunu necə anladığı haqqındadır.

## Problem: real DOM üzərində birbaşa dəyişikliklər

Əvvəllər, jQuery dövründə UI dəyişiklikləri birbaşa real DOM üzərində aparılırdı:

```jsx
document.querySelector('#user').textContent = 'Aisel';
```

Hər DOM əməliyyatı brauzerin render pipeline-ını yenidən işə salırdı. Bu proses layout hesablamalarını, paint mərhələsini və GPU üzərində compositing-i əhatə edirdi. Tək dəyişikliklər problem yaratmırdı, lakin bir neçə element eyni anda yenilənəndə performans sürətlə aşağı düşürdü.

Real DOM-un ağır olması React kimi framework-ləri alternativ yanaşma qurmağa vadar etdi. Nəticədə Virtual DOM anlayışı ortaya çıxdı.

## Virtual DOM nədir?

React və ya Vue istifadə edərkən UI deklarativ şəkildə yazılır — sən brauzerə necə işləməli olduğunu demirsən, sadəcə nə görmək istədiyini təsvir edirsən. Framework bu təsviri yaddaşda saxlanılan yüngül obyekt ağacına (Virtual DOM tree) çevirir:

```jsx
{
  type: 'div',
  props: { className: 'user', children: 'Aisel' },
  key: null
}
```

Virtual DOM real DOM deyil, brauzer API-lərinə toxunmur və yaddaşda saxlanılan yüngül bir modeldir. Onun əsas məqsədi dəyişiklikləri əvvəlcədən hesablamaqdır.

## Diff və Reconciliation

`setState()` və ya `props` dəyişdikdə komponent yenidən render olunur və yeni Virtual DOM ağacı yaranır. React köhnə və yeni ağacları müqayisə edir (diff):

1. `type` eynidirsə, node saxlanılır.
2. `props` dəyişibsə, yalnız fərqlər tətbiq olunur.
3. `children` fərqlidirsə, həmin hissə rekursiv diff olunur.
4. `key` fərqlidirsə, köhnə node silinib yenisi yaradılır.

Nəticədə React minimal DOM əməliyyatı siyahısı çıxarır və commit mərhələsində onları batch şəklində real DOM-a tətbiq edir. Brauzer yalnız həmin dəyişikliklərə görə reflow/paint edir.

## React Fiber

React 16-dan əvvəl diff prosesi sinxron idi və böyük tətbiqlərdə UI-nin donmasına səbəb olurdu. Fiber render işlərini hissələrə bölür, prioritetlər təyin edir və lazım olduqda renderi dayandırıb davam etdirir — beləliklə UI responsive qalır.

## Faydaları və məhdudiyyətləri

- **Minimal DOM əməliyyatı:** çoxlu kiçik dəyişiklik əvvəlcə JS-də hesablanır, sonra bir batch olaraq tətbiq olunur.
- **Deklarativ məntiq:** developer yalnız State → UI əlaqəsini düşünür.
- **Platform müstəqilliyi:** eyni konsept React Native və React Three Fiber kimi sahələrdə də işləyir.

Lakin Virtual DOM-un da çatışmazlıqları var: hər renderdə JS səviyyəsində diff ağac travers edir (CPU yükü), müasir brauzerlər DOM manipulyasiyalarını özü optimallaşdırır, Svelte və SolidJS kimi reaktiv sistemlər isə dəyər səviyyəsində izləmə apardığı üçün daha yüngüldür.

> **Nəticə:** Virtual DOM real DOM-un JS səviyyəsində təqlididir. Məqsəd DOM əməliyyatlarını azaltmaq, yeniləmələri qruplaşdırmaq və performansla yanaşı deklarativ UI modelini mümkün etməkdir.
