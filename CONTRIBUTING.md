# Contributing

Thanks for helping keep these guides accurate. Tools change fast, and a guide is only useful if every step still works.

## How changes get published

1. Open a pull request against `main`.
2. Automated checks run (frontmatter, images, formatting).
3. A PayPerQ maintainer reviews the change and checks a preview of the page.
4. When a maintainer approves the pull request and merges it, the guide goes live on ppq.ai.

An approved pull request is the sign-off to publish. Nothing is published before that.

## Editing a guide

For a small fix you do not need git: open the file under `guides/` on GitHub, click the pencil icon, make the change and choose "Propose changes". GitHub forks the repository and opens the pull request for you.

- Change only what you have checked yourself, and say in the pull request how you checked it (tool version, OS, what you ran).
- Use model IDs from the live catalog: [api.ppq.ai/v1/models](https://api.ppq.ai/v1/models).
- Never paste a real API key, in text or in a screenshot. Use the placeholder `<your PayPerQ API key>`.
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
4. Cover: what the tool is, install, adding PayPerQ as the provider (base URL `https://api.ppq.ai` and API key), choosing a model, a test prompt, and troubleshooting. Prerequisites list only specific items (account and key, a runtime version the tool requires), not filler like "internet access".
5. Do not add "What is PayPerQ?" or "Getting Started" sections: ppq.ai appends them to every guide.
6. When you show a model list or config, say it is an example and link the live catalog [api.ppq.ai/v1/models](https://api.ppq.ai/v1/models).

## Before opening the pull request

```bash
node scripts/check.mjs --write
```

This validates every guide and updates `index.json`. Commit the updated `index.json` with your change. Requires Node 18+, no install step.
