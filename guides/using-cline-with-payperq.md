---
title: Using Cline AI coding agent (VS Code extension and CLI) with PayPerQ
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

Cline is an AI coding agent that lets you pair program with AI models by editing your codebase using natural language. It runs as a VS Code extension (also in Cursor, Windsurf, VSCodium and JetBrains IDEs) and as a command-line tool. Both can use PayPerQ through Cline's "OpenAI Compatible" provider.

## What you need

- A PayPerQ API key. Open [ppq.ai/api-docs](https://ppq.ai/api-docs): your key is shown (masked) in the "Your API Key" box with a copy button, and the "Base URL" box shows `https://api.ppq.ai`. You can create separate keys for different applications at [ppq.ai/api-keys](https://ppq.ai/api-keys).
- A model ID that exists on PayPerQ and supports tools (Cline needs tool calling). Good choices:
  - `claude-sonnet-5.5` (supports tools; $2.11 input / $10.55 output per 1M tokens)
  - `anthropic/claude-haiku-5.5` (supports tools; a lower-cost option at $0.1055 input / $0.5275 output per 1M tokens)

  The full list is at `https://api.ppq.ai/v1/models` (no key needed). Use the `id` exactly as listed. Older IDs such as `claude-3.7-sonnet` are no longer available.

## Option A: VS Code extension

### 1. Install Cline

Open the Extensions view (`Ctrl/Cmd + Shift + X`), search for `Cline` and click Install. The extension identifier is `saoudrizwan.claude-dev`. (Cursor, Windsurf and VSCodium use the same steps; the last two install from Open VSX.)

### 2. Choose "Bring my own API key"

Click the Cline icon in the activity bar. On first run Cline asks "How will you use Cline?". Select **Bring my own API key** and click **Continue**.

![Cline first run screen](/blog-images/using-cline-with-payperq/01-extension-first-run.png)

### 3. Select OpenAI Compatible and enter the PayPerQ details

On "Configure your provider", the API Provider defaults to OpenRouter. Open that dropdown and choose **OpenAI Compatible**, then fill in:

- **Base URL:** `https://api.ppq.ai`
- **OpenAI Compatible API Key:** `<your PayPerQ API key>`
- **Model ID:** `claude-sonnet-5.5` (or another ID from the list above; the field is empty by default, so you must fill it in)

![Cline OpenAI Compatible settings for PayPerQ](/blog-images/using-cline-with-payperq/02-extension-openai-compatible.png)

Click **Continue**. You can change these values any time later: click the gear icon in the Cline panel, open **Settings → API Configuration**, edit the fields and click **Done**.

![Cline settings page](/blog-images/using-cline-with-payperq/03-extension-settings.png)

### 4. Try it

Type a short task in the Cline chat box. Cline can read and edit files and run commands in your project, and by default some actions are auto-approved (see the "Auto-approve" bar above the chat box), so review what it is allowed to do before giving it real work.

## Option B: Cline CLI

Requires Node.js 20 or newer (22 recommended).

### 1. Install

```bash
npm install -g cline
cline --version
```

### 2. Connect it to PayPerQ

Run `cline auth` and answer the prompts:

1. "Welcome to Cline": choose **Bring your own provider**.
2. "Choose a provider": type `openai` and select **OpenAI Compatible**.
3. **Base URL:** the field is pre-filled with `https://api.openai.com/v1`. Clear it first (`Ctrl+U`), then type `https://api.ppq.ai`. Leave the Azure API version alone.
4. **API key:** paste `<your PayPerQ API key>`. Note that the CLI shows the key in clear text while you type.
5. **Model ID:** the field is pre-filled with `gpt-4o`, which is not a PayPerQ model ID. Clear it (`Ctrl+U`) and type `claude-sonnet-5.5`, then press Enter.

![Cline CLI provider setup](/blog-images/using-cline-with-payperq/04-cli-openai-compatible-form.png)

`cline auth` then exits without printing anything. To skip the prompts you can pass everything as flags instead (this puts your key in your shell history):

```bash
cline auth openai-compatible -k "<your PayPerQ API key>" -b https://api.ppq.ai -m claude-sonnet-5.5
```

### 3. Run it

```bash
cd your-project
cline
```

On first launch a "Try ClinePass" promo may appear; press any key other than Enter (for example Esc) to close it. Type your task at the prompt. The status line shows the active model (for example `claude-sonnet-5.5`) and `Plan / Act (Tab)`. The CLI starts in Act mode with auto-approve enabled for tools; press `Tab` to switch to Plan mode, or `Shift+Tab` to turn auto-approve off, if you want to approve each action yourself. You can also run a single task with `cline "your task"`.

The extension and the CLI share the same settings folder (`~/.cline`), so configuring one pre-fills the other.

## JetBrains IDEs

Install the Cline plugin (Settings → Plugins → Marketplace → search "Cline", then restart the IDE), open it from View → Tool Windows → Cline, and use the same provider settings as in Option A.

## Problems?

- `Invalid API key` in Cline means PayPerQ rejected the key. Re-copy it from [ppq.ai/api-docs](https://ppq.ai/api-docs) (or create a new one at [ppq.ai/api-keys](https://ppq.ai/api-keys)) and check there are no extra spaces.
- Model errors usually mean the Model ID is not on PayPerQ. Copy an `id` from `https://api.ppq.ai/v1/models`.
- Check your spending at [ppq.ai/account-activity](https://ppq.ai/account-activity).

Still stuck? Contact us through the customer communication chatbot in the bottom right of ppq.ai, in our [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh) or on [Discord](https://discord.gg/BmMntEShYg).
