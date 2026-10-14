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

Cline is an AI coding assistant that pair programs with AI models by editing your codebase using natural language. It is available as a VS Code extension and as a command line tool (CLI). Both can use PayPerQ through Cline's "OpenAI Compatible" provider.

## Before you start

You need three values from PayPerQ:

- **Base URL:** `https://api.ppq.ai`
- **API key:** open [ppq.ai/api-docs](https://ppq.ai/api-docs) and copy the key from the "Your API Key" box (use the copy button). If you want a separate key for Cline, create one at [ppq.ai/api-keys](https://ppq.ai/api-keys).
- **Model ID:** any model from the PayPerQ catalog that supports tools, for example `claude-sonnet-5.5`. The full list is public at [api.ppq.ai/v1/models](https://api.ppq.ai/v1/models). Use the exact `id` from that list.

## Option 1: Cline in VS Code

### 1. Install the extension

Open the Extensions view, search for **Cline** (publisher `saoudrizwan`) and click **Install**. If VS Code asks whether you trust the publisher, confirm to continue.

![Search for Cline in the VS Code extension marketplace](/blog-images/using-cline-with-payperq/01-vscode-marketplace-search-cline.png)

### 2. Choose "Bring my own API key"

Click the Cline icon in the activity bar. On first run Cline asks "How will you use Cline?". Select **Bring my own API key** and click **Continue**.

![Cline first-run screen](/blog-images/using-cline-with-payperq/03-ext-cline-first-run-welcome.png)

![Bring my own API key selected](/blog-images/using-cline-with-payperq/04-ext-bring-my-own-api-key.png)

### 3. Select the OpenAI Compatible provider and enter your PayPerQ details

On "Configure your provider", open the **API Provider** box (it starts on a different provider, not OpenAI Compatible), type `OpenAI Compat` and pick **OpenAI Compatible**.

![Picking OpenAI Compatible as the API provider](/blog-images/using-cline-with-payperq/06-ext-provider-search-openai-compatible.png)

Then fill in:

1. **Base URL:** `https://api.ppq.ai`
2. **OpenAI Compatible API Key:** your PayPerQ API key from [ppq.ai/api-docs](https://ppq.ai/api-docs)
3. **Model ID:** after you enter the URL and key, Cline loads the PayPerQ model list ("Loading models..."). Wait for it, open the **Model ID** box and pick a model, for example `claude-sonnet-5.5`.

![Base URL and API key entered](/blog-images/using-cline-with-payperq/07-ext-base-url-and-key-entered.png)

![Model ID list loaded from PayPerQ](/blog-images/using-cline-with-payperq/08-ext-model-id-dropdown-from-ppq.png)

![All fields filled in](/blog-images/using-cline-with-payperq/09-ext-all-fields-filled.png)

Click **Continue**. You can change these settings later with the gear icon in the Cline panel (API Configuration), then click **Done**.

![Cline settings](/blog-images/using-cline-with-payperq/12-ext-settings-view.png)

### 4. Send a prompt

Type your task in the Cline chat box and press Enter.

![Cline ready for a task](/blog-images/using-cline-with-payperq/10-ext-ready-to-chat.png)

Note: for custom providers Cline shows a context size of 128K and a cost of "Free" / `$0.0000`. That is Cline's own meter, not your PayPerQ spend. Check real usage and cost at [ppq.ai/account-activity](https://ppq.ai/account-activity). You can enter the context window and prices yourself under "Model Configuration" in the settings.

## Option 2: Cline CLI

### 1. Install

You need Node.js 20 or newer. Then run:

```bash
npm install -g cline
```

### 2. Start Cline and connect PayPerQ

Run `cline` in your project folder. On first run choose **Bring your own provider**, type `openai` in the search box and select **OpenAI Compatible**.

![Cline CLI first run](/blog-images/using-cline-with-payperq/20-cli-first-run-welcome.png)

![Searching for OpenAI Compatible](/blog-images/using-cline-with-payperq/22-cli-search-openai.png)

On the form:

1. **Base URL** is prefilled with `https://api.openai.com/v1`. Clear it (press `Ctrl+U`) and type `https://api.ppq.ai`.
2. Press `Tab` twice (the optional Azure field sits in between) and paste your PayPerQ API key. The CLI shows the key in clear text while you type.
3. Press `Enter` to save.
4. On "Set model ID", the field is prefilled with `gpt-4o`, which is not a PayPerQ model. Clear it (`Ctrl+U`), type a model ID from the catalog, for example `claude-sonnet-5.5`, and press `Enter`.

![Base URL entered](/blog-images/using-cline-with-payperq/24-cli-base-url-entered.png)

![API key entered (masked here)](/blog-images/using-cline-with-payperq/25-cli-api-key-entered-masked.png)

![Model ID entered](/blog-images/using-cline-with-payperq/27-cli-model-id-entered.png)

A ClinePass promotion popup may appear; press any other key to close it.

You can also configure the provider without the interactive form:

```bash
cline auth openai-compatible -b https://api.ppq.ai -k YOUR_PPQ_API_KEY -m claude-sonnet-5.5
```

Keep in mind that a key typed on the command line can end up in your shell history.

### 3. Send a prompt

Type your task at the prompt and press Enter.

![Cline CLI ready for a task](/blog-images/using-cline-with-payperq/29-cli-ready-to-chat.png)

Important: the CLI starts in Act mode with "Auto-approve all" enabled (shown at the bottom of the screen, toggle with `Shift+Tab`). That means Cline can edit files and run commands without asking first, and every request costs money. Switch between Plan and Act with `Tab`. `cline config` shows and changes the current settings.

## Problems?

- **"Invalid API key"** means Cline reached PayPerQ but the key is wrong or revoked. Copy your key again from [ppq.ai/api-docs](https://ppq.ai/api-docs) (or [ppq.ai/api-keys](https://ppq.ai/api-keys)) and make sure Base URL is exactly `https://api.ppq.ai`.
- A model that is not in the [catalog](https://api.ppq.ai/v1/models) will not work. Cline's own defaults such as `gpt-4o` are not PayPerQ model IDs.

Please contact us through the customer communication chatbot in the bottom right of ppq.ai, in our [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh) or on [Discord](https://discord.gg/BmMntEShYg)!
