# Welcome to PayPerQ's integration guides

Step-by-step guides for using third-party AI tools, such as coding agents, chat apps and editors, with [PayPerQ](https://ppq.ai) as the model provider. Every guide in `guides/` is published at [ppq.ai/blog](https://ppq.ai/blog).

This is a community effort. Tools change fast, and a guide is only useful while every step still works, so anyone who spots a problem can fix it here. PayPerQ maintainers review every change before it goes live.

## Found a mistake in a guide?

Pick whichever fits:

### 1. A small fix, such as a typo or a wrong flag

No git needed.

1. Open the guide under [`guides/`](guides/) on GitHub.
2. Click the pencil icon ("Edit this file") at the top right of the file.
3. Make the change and click "Commit changes...".
4. Choose "Create a new branch for this commit and start a pull request" and click "Propose changes".

GitHub forks the repository for you and opens the pull request. Say in the description how you checked the fix (tool version, OS, what you ran).

### 2. A step does not work and you are not sure of the fix

[Open an issue](https://github.com/PayPerQ/ppq-integration-guides/issues/new?template=guide-problem.yml). Name the guide and the step, say what happened instead, and give the tool version and your OS. A maintainer or another reader picks it up from there.

### 3. A bigger change, or a new guide

Fork the repository, make the change on a branch, run `node scripts/check.mjs --write`, and open a pull request. [CONTRIBUTING.md](CONTRIBUTING.md) has the details and the frontmatter a new guide needs.

## What happens to your pull request

1. Automated checks run: frontmatter, images, formatting, the generated `index.json`.
2. A PayPerQ maintainer reviews the change and looks at a preview of the page.
3. When the maintainer approves and merges it, ppq.ai picks up the change within a few minutes.

Nothing is published before a maintainer approves it.

## Layout

| Path | What |
|---|---|
| `guides/<slug>.md` | One guide per file. The file name is the URL: `ppq.ai/blog/<slug>`. |
| `blog-images/<slug>/` | Images used by that guide, referenced as `/blog-images/<slug>/<file>`. |
| `index.json` | Generated list of guides that ppq.ai reads. Do not edit by hand. |
| `scripts/check.mjs` | Validates the guides and regenerates `index.json`. |

## Model IDs

Guides show a few models as examples. The full, current list is the live catalog at [api.ppq.ai/v1/models](https://api.ppq.ai/v1/models), which includes each model's context length, pricing and supported parameters.

## Rules for every guide

- Only steps you have checked yourself.
- Never a real API key, in text or in a screenshot. Use the placeholder `<your PayPerQ API key>`.
- Plain Markdown. Raw HTML is not rendered on ppq.ai.
