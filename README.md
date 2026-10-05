# PayPerQ Integration Guides

Step-by-step guides for using third-party AI tools (coding agents, chat apps, editors) with [PayPerQ](https://ppq.ai) as the model provider.

Every guide here is published on [ppq.ai/blog](https://ppq.ai/blog). When a pull request is merged into `main`, the site picks up the change within a few minutes.

## Layout

| Path | What |
|---|---|
| `guides/<slug>.md` | One guide per file. The file name is the URL: `ppq.ai/blog/<slug>`. |
| `blog-images/<slug>/` | Images used by that guide, referenced as `/blog-images/<slug>/<file>`. |
| `index.json` | Generated list of guides that ppq.ai reads. Do not edit by hand. |
| `scripts/check.mjs` | Validates the guides and regenerates `index.json`. |

## Contributing

Found a step that no longer works, or want to add a guide for a tool? See [CONTRIBUTING.md](CONTRIBUTING.md).
