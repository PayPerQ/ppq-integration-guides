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

Goose is an AI powered CLI and app that enables you to use natural language to work with your code base via help from AI.

## Step by Step Set Up

### 1. Install Goose

Follow the [official Goose installation guide](https://goose-docs.ai/docs/getting-started/installation/) (Goose's docs moved from block.github.io to goose-docs.ai, and the project now lives at [github.com/aaif-goose/goose](https://github.com/aaif-goose/goose)). To install the CLI on macOS, Linux or Windows (Git Bash / WSL):

```bash
curl -fsSL https://github.com/aaif-goose/goose/releases/download/stable/download_cli.sh | bash
```

On Linux you may need `bzip2` (`sudo apt install bzip2`). If `~/.local/bin` is not on your PATH, the installer offers to add it for you (or shows instructions to do it yourself). Accept or follow them, then open a new terminal.

The installer immediately starts `goose configure` for you (the next steps).

### 2. Get your PPQ API key

Open the [PPQ API page](https://ppq.ai/api-docs). Copy the key from the "Your API Key" box. The "Base URL" box on the same page shows `https://api.ppq.ai`. You can create separate keys per application on the [API keys page](https://ppq.ai/api-keys).

### 3. Run `goose configure` and pick the OpenAI provider

In the terminal, run `goose configure` (the installer does this for you the first time). Answer the prompts as follows:

1. **Share anonymous usage data?** Your choice (Yes / No).
2. **How would you like to set up your provider?** Choose **Manual Configuration** (not the login options).
3. **Which model provider should we use?** Choose **Search all providers...**, type `openai`, press Enter, and choose **OpenAI (GPT-4 and other OpenAI models, including OpenAI compatible ones)**. PPQ is OpenAI-compatible, so this is the provider to use.

![Goose provider choice](/blog-images/using-goose-with-payperq/04-select-openai-provider.png)

### 4. Enter the PPQ values

Continue with the prompts:

| Prompt | Value |
|---|---|
| Would you like to set OPENAI_API_KEY? | Yes, then paste your PPQ API key |
| Would you like to configure advanced settings? | Yes |
| OPENAI_BASE_URL (optional) | `https://api.ppq.ai` |
| OPENAI_HOST | `https://api.ppq.ai` |
| OPENAI_BASE_PATH | `v1/chat/completions` (the default) |
| OPENAI_ORGANIZATION, OPENAI_PROJECT | leave empty (press Enter) |
| Would you like to set OPENAI_CUSTOM_HEADERS? | **No** (choosing Yes forces you to enter a value) |
| OPENAI_TIMEOUT | leave the default (press Enter) |

![Goose configure values](/blog-images/using-goose-with-payperq/05-ppq-values.png)

Goose then fetches PPQ's model list ("384 models available" at the time of writing) and asks you to pick a model. Type a filter such as `claude-sonnet`, press Enter, and select for example `claude-sonnet-5.5`. Choose a model that supports tools, since Goose is an agent; you can browse models and prices on [PPQ's model list](https://api.ppq.ai/v1/models). Finally pick a thinking effort (**Off** is fine to start). Goose sends a test request with your key and saves the configuration if it succeeds.

### 5. Start Goose

```bash
goose session
```

Type a request and press Enter. Check your spend on the [account activity page](https://ppq.ai/account-activity). To switch model later, run `goose configure` again.

### Troubleshooting

- `Authentication failed for https://api.ppq.ai/v1/chat/completions. Status: 401 ... API key not found or has been revoked`: the key is wrong or was revoked. Copy it again from the [API page](https://ppq.ai/api-docs). Goose does not save the configuration until this test request succeeds, so just re-run `goose configure`.
- `goose: command not found` right after installing: open a new terminal, or follow the PATH instructions the installer printed.

## Problems?

Please contact us through the customer communication chatbot in the bottom right of ppq.ai, or in our [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh) or [Discord](https://discord.gg/BmMntEShYg)!
