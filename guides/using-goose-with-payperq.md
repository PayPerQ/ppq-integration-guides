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

Follow the [official Goose installation page](https://goose-docs.ai/docs/getting-started/installation). On Linux and macOS, run this from your home directory (or any folder you can write to):

```bash
curl -fsSL https://github.com/aaif-goose/goose/releases/download/stable/download_cli.sh | bash
```

The installer puts `goose` in `~/.local/bin` and then starts `goose configure` for you. If it tells you that `~/.local/bin` is not in your PATH, let it add it or add it yourself, then open a new terminal. (If you would rather configure later, use `curl -fsSL https://github.com/aaif-goose/goose/releases/download/stable/download_cli.sh | CONFIGURE=false bash`, then run `goose configure` yourself.) Windows and the Desktop app are covered on the same page; the steps below use the `goose configure` command line wizard.

### 2. Get your PayPerQ API key

Open the [PPQ API page](https://ppq.ai/api-docs) and copy your key from the "Your API Key" box. The same page shows the base URL, `https://api.ppq.ai`. You can create separate keys for different apps on the [API keys page](https://ppq.ai/api-keys).

### 3. Choose the OpenAI provider in Goose

In the `goose configure` wizard:

1. Answer the usage-data question as you like.
2. At "How would you like to set up your provider?", choose **Manual Configuration**.
3. At "Which model provider should we use?", choose **Search all providers...**, type `openai`, and select **OpenAI (GPT-4 and other OpenAI models, including OpenAI compatible ones)**. This built-in provider also works with any OpenAI-compatible service such as PayPerQ.

![Goose provider list after choosing Manual Configuration](/blog-images/using-goose-with-payperq/02-manual-configuration-provider-list.png)

### 4. Enter the PayPerQ values

Answer the next prompts like this (your key is shown masked):

![Goose OpenAI prompts filled in for PayPerQ](/blog-images/using-goose-with-payperq/03-openai-values-and-model-fetch.png)

| Prompt | Value |
| --- | --- |
| Would you like to set OPENAI_API_KEY? | Yes, then paste `<your PayPerQ API key>` |
| Would you like to configure advanced settings? | Yes (needed to change the host) |
| Enter OPENAI_BASE_URL | `https://api.ppq.ai/v1` |
| OPENAI_HOST | `https://api.ppq.ai` |
| OPENAI_BASE_PATH | `v1/chat/completions` (the default, just press Enter) |
| OPENAI_ORGANIZATION, OPENAI_PROJECT | leave empty |
| OPENAI_CUSTOM_HEADERS | No |
| OPENAI_TIMEOUT | press Enter |

Goose then fetches the model list from PayPerQ ("Model fetch complete") and asks you to pick a model. `gpt-5.4-mini` is a good low-cost choice, and `gpt-5.4-nano` is cheaper still; `gpt-6.1-sol` and `gpt-5.3-codex` are also offered and support tools. You can type any other model ID from the [PPQ model list](https://api.ppq.ai/v1/models) through "Search all models..." or "Enter a model not listed...", but Goose uses tool calling, so first check that the model's `supported_parameters` in that list includes `tools`. Pick "Off" for thinking effort unless you want extended reasoning, and choose the Goose mode you prefer. In "Auto" mode Goose may change files without asking, while "Approve" and "Chat" are more cautious. The wizard ends with "Configuration saved successfully".

### 5. Try it

Go to a project folder and start a session:

```bash
goose session
```

The banner should show `openai` and your model. Type a short message such as `Reply with the word OK`. If you get an answer, PayPerQ is working.

![Goose session answering through PayPerQ](/blog-images/using-goose-with-payperq/04-goose-session-ok.png)

Usage and costs show up on [your account activity page](https://ppq.ai/account-activity).

To change anything later, run `goose configure` again.

## Problems?

If you see an authentication error (401), check that you pasted the full key from the [PPQ API page](https://ppq.ai/api-docs). Otherwise contact us through the customer communication chatbot in the bottom right of the site, in our [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh), or on [Discord](https://discord.gg/BmMntEShYg).
