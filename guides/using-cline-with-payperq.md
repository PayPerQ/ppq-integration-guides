---
title: Using Cline AI pair programming CLI with PayPerQ
slug: using-cline-with-payperq
date: 2026-10-14
image: /blog-images/using-cline-with-payperq/cline_og_img.png
ogImage: /blog-images/using-cline-with-payperq/cline_og_img.png
intro:
description: 
author: Matt Ahlborg
tags:
  - Third Party Integrations
---

## What is Cline?

Cline is an AI coding agent that lets you pair program with AI models by editing your codebase using natural language. It comes as a VS Code extension and as a terminal CLI. Both can use PayPerQ through Cline's "OpenAI Compatible" provider.

## Before you start

1. Get your PayPerQ API key at [ppq.ai/api-docs](https://ppq.ai/api-docs). It is in the "Your API Key" box (masked, with a copy button). You can create separate keys for different applications at [ppq.ai/api-keys](https://ppq.ai/api-keys).
2. Pick a model ID from the live PayPerQ model list at `https://api.ppq.ai/v1/models`. Cline works through tool calls, so choose a model whose `supported_parameters` include `tools`. This guide was tested with `anthropic/claude-haiku-5.5`, a small, cheap model that answered correctly through both the extension and the CLI. Larger models such as `claude-sonnet-5.5` are listed with tool support as well.

In the steps below, `<your PayPerQ API key>` stands for the key you copied.

## Option A: VS Code extension

### 1. Install the extension

In VS Code, press `Ctrl/Cmd + Shift + X`, search for `Cline` (publisher `saoudrizwan`, extension ID `saoudrizwan.claude-dev`) and click Install. Cline then appears as an icon in the activity bar.

### 2. Choose "Bring my own API key"

Open the Cline panel. On first run you see "How will you use Cline?". Select **Bring my own API key** and click **Continue**.

![Cline first-run screen with the Bring my own API key option](/blog-images/using-cline-with-payperq/01-onboarding.png)

### 3. Enter the PayPerQ settings

On "Configure your provider", fill in:

- **API Provider**: `OpenAI Compatible` (type "OpenAI Compat" in the search box and pick it)
- **Base URL**: `https://api.ppq.ai`
- **OpenAI Compatible API Key**: `<your PayPerQ API key>`
- **Model ID**: `anthropic/claude-haiku-5.5` (or another model ID from the PayPerQ model list)

Click **Continue**.

![Cline provider settings filled in for PayPerQ](/blog-images/using-cline-with-payperq/02-provider-config.png)

You can change these values later with the settings gear icon at the top of the Cline panel.

### 4. Send a first message

Cline opens its chat view. Type a short task such as `Reply with the word OK` and press Enter. You should get an answer from your PayPerQ model.

![Cline chat view ready to use](/blog-images/using-cline-with-payperq/03-chat-ready.png)

## Option B: Cline CLI

### 1. Install

You need Node.js 20 or newer. Then run:

```bash
npm install -g cline
```

### 2. Connect PayPerQ

Run `cline auth` and go through the prompts:

1. Welcome screen: choose **Bring my own provider**.
2. Type `OpenAI Compatible` in the search box and press Enter on **OpenAI Compatible**.
3. **Base URL** is prefilled with `https://api.openai.com/v1`. Delete it first (Ctrl+U), then type `https://api.ppq.ai`.
4. Press Tab twice to reach **API key** (the optional Azure field is in between) and paste `<your PayPerQ API key>`. The CLI shows the key in clear text while you type, so do not do this on a shared screen. Press Enter.
5. **Model ID** is prefilled with `gpt-4o`, which is not a valid PayPerQ model ID because it has no provider prefix. Delete it (Ctrl+U), type `anthropic/claude-haiku-5.5` (or another ID from the model list) and press Enter.

The CLI returns to your shell without a confirmation message. The settings are saved in `~/.cline/data/settings/providers.json` (including your key, in plain text), and the VS Code extension reads the same file.

### 3. Run Cline

In your project folder run `cline`. On first launch a ClinePass promo may appear; press any key to close it. Type a short task, for example `Reply with the word OK`, and press Enter.

## Good to know

- Cline starts with auto-approve switched on for reading and editing files (the CLI footer says "Auto-approve all enabled"; the extension lists "Read, Edit, Web Fetch, MCP"). Review these settings before pointing it at an important repository.
- Cline shows a cost of $0.00 for PayPerQ models because it does not know their prices. Your real usage and costs are at [ppq.ai/account-activity](https://ppq.ai/account-activity).
- If you get an error such as "No endpoints found for ...", Cline sent a model ID that PayPerQ does not know. We saw this after configuring the CLI and the extension on the same machine, because they share one settings file. Open the settings, re-select **OpenAI Compatible** and enter a model ID from `https://api.ppq.ai/v1/models`.
- A "401 Invalid API key" error means the key was not accepted. Copy it again from ppq.ai/api-docs.

## Problems?

Please contact us through the customer communication chatbot in the bottom right of ppq.ai, in our [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh) or on [Discord](https://discord.gg/BmMntEShYg).
