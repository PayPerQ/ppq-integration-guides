# Contributing

Thanks for helping keep these guides accurate. Tools change fast, and a guide is only useful if every step still works.

## How changes get published

1. Open a pull request against `main`.
2. Automated checks run (frontmatter, images, formatting).
3. A PayPerQ maintainer reviews the change and checks a preview of the page.
4. When a maintainer approves the pull request and merges it, the guide goes live on ppq.ai.

An approved pull request is the sign-off to publish. Nothing is published before that.

## Editing a guide

- Change only what you have checked yourself, and say in the pull request how you checked it (tool version, OS, what you ran).
- Leave `date` alone (it is the publication date) and set `updated: YYYY-MM-DD` to today when you change the guide's content, so readers see it was revised.
- Use model IDs from the live catalog: [api.ppq.ai/v1/models](https://api.ppq.ai/v1/models).
- Never paste a real API key, in text or in a screenshot. Use a placeholder like `sk-...`.
- Plain Markdown only. Raw HTML is not rendered on ppq.ai.

## Adding a guide

1. Create `guides/<slug>.md`, where `<slug>` is lowercase with dashes, for example `using-mytool-with-payperq`.
2. Start it with this frontmatter:

   ```yaml
   ---
   title: Using MyTool with PayPerQ
   slug: using-mytool-with-payperq
   date: 2026-01-31
   image: /blog-images/using-mytool-with-payperq/cover.png
   ogImage: /blog-images/using-mytool-with-payperq/cover.png
   intro: One sentence shown in the blog listing.
   author: Your Name
   tags:
     - Third Party Integrations
   ---
   ```

3. Put images in `blog-images/<slug>/`.
4. Cover: what the tool is, install, adding PayPerQ as the provider (base URL `https://api.ppq.ai` and API key), choosing a model, a test prompt, and troubleshooting.

## Before opening the pull request

```bash
node scripts/check.mjs --write
```

This validates every guide and updates `index.json`. Commit the updated `index.json` with your change. Requires Node 18+, no install step.
