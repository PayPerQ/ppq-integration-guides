---
title: Using Goose AI CLI with PayPerQ
slug: using-goose-with-payperq
date: 2026-10-14
image: /blog-images/using-goose-with-payperq/goose.png
ogImage: /blog-images/using-goose-with-payperq/goose_og.png
intro:
description: 
author: Matt Ahlborg
tags:
  - Third Party Integrations
---

## What is Goose?

Goose is an AI powered CLI and app that enables you to use natural language to work with your code base via help from AI. It is an open source project; the code and docs now live at [github.com/aaif-goose/goose](https://github.com/aaif-goose/goose) and [goose-docs.ai](https://goose-docs.ai/docs/getting-started/installation/).

This guide uses Goose's built-in **OpenAI** provider and points it at PayPerQ, because PayPerQ's API is OpenAI compatible.

## Step by Step Set Up

### 1. Install Goose

Follow the official [Goose installation page](https://goose-docs.ai/docs/getting-started/installation/). For the CLI on Linux or macOS the command is:

```bash
curl -fsSL https://github.com/aaif-goose/goose/releases/download/stable/download_cli.sh | bash
```

The installer puts `goose` in `~/.local/bin` and then immediately starts Goose's interactive setup (the same thing `goose configure` does). If you would rather configure later, run the installer with `CONFIGURE=false`:

```bash
curl -fsSL https://github.com/aaif-goose/goose/releases/download/stable/download_cli.sh | CONFIGURE=false bash
```

If your shell says `goose: command not found` right after installing, open a new terminal (or log in again) so that `~/.local/bin` is on your `PATH`.

### 2. Get your PayPerQ API key

Go to [ppq.ai/api-docs](https://ppq.ai/api-docs) and copy the key from the **Your API Key** box. You can create separate keys for separate tools at [ppq.ai/api-keys](https://ppq.ai/api-keys). Below, the key is written as `<your PayPerQ API key>`.

### 3. Start the provider setup

If the installer already started the setup, continue there. Otherwise run:

```bash
goose configure
```

Answer the questions as follows:

1. **Share anonymous usage data?** Your choice (it is Goose's own telemetry, unrelated to PayPerQ).
2. **How would you like to set up your provider?** Choose **Manual Configuration**. (Do not pick "OpenRouter Login" or "Tetrate Agent Router Service Login", those send you to other services.)
3. **Which model provider should we use?** Choose **OpenAI** (described as "GPT-4 and other OpenAI models, including OpenAI compatible ones"). The list is long and alphabetical and has no type-to-filter: scroll with the arrow keys to **OpenAI**, which sits just before **OpenCode Go**. Pressing Enter selects whatever is highlighted.

![Goose asks how to set up the provider](/blog-images/using-goose-with-payperq/01-provider-method.png)

![Scroll to OpenAI in the provider list](/blog-images/using-goose-with-payperq/02-provider-openai.png)

### 4. Enter your PayPerQ values

| Prompt | What to enter |
| --- | --- |
| `Would you like to set OPENAI_API_KEY?` | **Yes**, then paste `<your PayPerQ API key>` (the input is masked) |
| `Would you like to configure advanced settings?` | **Yes**. The default is No, and if you leave it at No Goose keeps talking to `api.openai.com` instead of PayPerQ. |
| `Enter OPENAI_BASE_URL (optional)` | Press Enter to skip |
| `Provider OpenAI requires OPENAI_HOST` | `https://api.ppq.ai` |
| `Provider OpenAI requires OPENAI_BASE_PATH` | `v1/chat/completions` (this is the default, just press Enter) |
| `Enter OPENAI_ORGANIZATION` / `OPENAI_PROJECT` | Press Enter to skip both |
| `Would you like to set OPENAI_CUSTOM_HEADERS?` | **No**. Careful: the default is Yes, and if you press Enter on Yes, Goose then refuses an empty value ("Input required") and you have to cancel with Ctrl-C and start over. |
| `Enter OPENAI_TIMEOUT` | Press Enter to keep the default (600) |

![Goose OpenAI settings pointing at PayPerQ](/blog-images/using-goose-with-payperq/04-host-basepath.png)

### 5. Pick a model

Goose loads the model list from PayPerQ (`https://api.ppq.ai/v1/models`) and shows a few suggestions, for example `gpt-5.4-nano`, `gpt-5.4-mini`, `gpt-6.1-sol` and `gpt-5.3-codex`. Choose one, or pick **Search all models...** / **Enter a model not listed...** to use any other model ID from the [PayPerQ model list](https://api.ppq.ai/v1/models).

Goose works by calling tools, so choose a model whose `supported_parameters` in that list include `tools`. Cheaper models such as `gpt-5.4-nano` are a good way to try things out.

![Goose model selection](/blog-images/using-goose-with-payperq/06-model-select.png)

Goose then asks for a **thinking effort** (Off, Low, Medium, High, Max). **Off** is fine to start with.

### 6. Check the connection and chat

At the end of the setup Goose sends a test request to PayPerQ. If your key is wrong or revoked you will see an `Authentication error ... 401 Unauthorized` and Goose will **not** save the configuration; copy the key again from [ppq.ai/api-docs](https://ppq.ai/api-docs) and run `goose configure` again.

Once it is saved, start a chat in your project folder:

```bash
goose session
```

You can check your usage and costs at [ppq.ai/account-activity](https://ppq.ai/account-activity).

## Goose Desktop app

We have not tested the Goose Desktop app with PayPerQ, so this section is based only on the Goose documentation. The Desktop welcome screen offers **Other Providers**, and the Goose docs describe an **Add Custom Provider** form with provider type "OpenAI Compatible", where you would enter PayPerQ's base URL (`https://api.ppq.ai`) and your PayPerQ API key. Follow the [Goose Desktop documentation](https://goose-docs.ai/docs/getting-started/installation/) and check it against the current Desktop screens; the CLI steps above are the ones we verified.

## Problems?

- `401 Unauthorized` or "API key not found or has been revoked": the key is wrong or revoked. Copy it again from [ppq.ai/api-docs](https://ppq.ai/api-docs).
- Requests seem to go to OpenAI instead of PayPerQ: you answered No to "configure advanced settings". Run `goose configure` again and answer Yes.

Please contact us through the customer communication chatbot in the bottom right of ppq.ai, in our [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh), or on [Discord](https://discord.gg/BmMntEShYg)!
