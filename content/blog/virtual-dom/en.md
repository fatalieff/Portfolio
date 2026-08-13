---
title: "Why was the Virtual DOM created?"
date: 2026-08-13
excerpt: "From the jQuery era to React Fiber — a short explanation of how heavy the real DOM is, diff/reconciliation, and why the Virtual DOM came to be."
tags: [Virtual DOM, React, Performance]
---

This article is about why the Virtual DOM was created and how the browser understands content.

## The problem: direct changes on the real DOM

Back in the jQuery era, UI changes were made directly on the real DOM:

```jsx
document.querySelector('#user').textContent = 'Aisel';
```

Every DOM operation restarted the browser's render pipeline — layout calculations, the paint stage, and GPU compositing. Single changes were fine, but when several elements updated at once, performance dropped fast.

Because the real DOM is heavy, frameworks like React were pushed to build an alternative approach. The Virtual DOM concept was the result.

## What is the Virtual DOM?

With React or Vue, the UI is written declaratively — you don't tell the browser how to work, you just describe what you want to see. The framework turns that description into a lightweight object tree kept in memory (the Virtual DOM tree):

```jsx
{
  type: 'div',
  props: { className: 'user', children: 'Aisel' },
  key: null
}
```

The Virtual DOM is not the real DOM, doesn't touch browser APIs, and is a lightweight in-memory model. Its main purpose is to compute changes ahead of time.

## Diff and Reconciliation

When `setState()` or `props` change, the component re-renders and a new Virtual DOM tree appears. React compares the old and new trees (diff):

1. If the `type` is the same, the node is kept.
2. If `props` changed, only the differences are applied.
3. If `children` differ, that subtree is diffed recursively.
4. If the `key` differs, the old node is removed and a new one is created.

As a result, React produces a minimal list of DOM operations and applies them to the real DOM as a batch in the commit phase. The browser only reflows/paints for those specific changes.

## React Fiber

Before React 16, the diff process was synchronous, which froze the UI in large apps. Fiber splits render work into units, assigns priorities, and can pause and resume rendering — keeping the UI responsive.

## Benefits and limitations

- **Minimal DOM operations:** many small changes are computed in JS first, then applied as a single batch.
- **Declarative logic:** developers only think about the State → UI relationship.
- **Platform independence:** the same concept works in React Native and React Three Fiber.

But the Virtual DOM has drawbacks too: every render traverses the tree in JS (CPU cost), modern browsers optimize DOM manipulation themselves, and reactive systems like Svelte and SolidJS track at the value level, making them lighter.

> **Summary:** The Virtual DOM is a JS-level imitation of the real DOM. Its purpose is to reduce DOM operations, batch updates, and enable a declarative UI model alongside performance.
