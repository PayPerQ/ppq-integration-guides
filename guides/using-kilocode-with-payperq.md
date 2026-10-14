---
title: Using Kilo Code AI pair programming extension with PayPerQ
slug: using-kilocode-with-payperq
date: 2026-10-14
image: /blog-images/using-kilocode-with-payperq/Screenshot from 2025-09-03 13-16-05.png
ogImage: /blog-images/using-kilocode-with-payperq/Screenshot from 2025-09-03 13-16-05.png
intro: Learn how to set up Kilo Code, the AI-powered VS Code extension for pair programming, to work seamlessly with PayPerQ's API.
author: Matt Ahlborg
tags:
  - Third Party Integrations
---

## What is Kilo Code?

Kilo Code is an AI coding agent that runs as a VS Code extension. You describe what you want in natural language and it can plan, write, edit and explain code in your project. This guide connects it to PayPerQ as a custom OpenAI-compatible provider.

## Step by Step Set Up

### 1. Install Kilo Code

Open the Extensions view in VS Code, search for "Kilo Code" (publisher `kilocode`) and install it. Kilo's own install page recommends clicking the dropdown arrow next to **Install** and choosing **Install Pre-Release Version**. In VSCodium, Windsurf and other editors that use the Open VSX Registry, install it from the Extensions view in the same way.

![Kilo Code in the extensions marketplace](/blog-images/using-kilocode-with-payperq/01-marketplace-kilo-code.png)

After installing, click the Kilo Code icon in the activity bar. The first time, the sidebar shows "Initializing..." for a short while (about half a minute in our test) while the extension starts its local server. Then it asks you to choose how you want to work: **Review first** (Kilo asks before editing files or running commands) or **High autonomy** (Kilo edits files and runs commands without asking). You can change this later in Kilo's settings. We recommend **Review first**.

![Kilo Code first-run welcome](/blog-images/using-kilocode-with-payperq/02-first-run-welcome.png)

### 2. Get your PayPerQ API key

Go to [ppq.ai/api-docs](https://ppq.ai/api-docs). The "Your API Key" box shows your key (masked, with a copy button), and the "Base URL" box shows `https://api.ppq.ai`. Copy the key. If you want a separate key for Kilo Code, create one at [ppq.ai/api-keys](https://ppq.ai/api-keys).

### 3. Add PayPerQ as a custom provider in Kilo Code

1. Click the gear icon in the Kilo Code sidebar header to open **Kilo Settings**, then choose **Providers**.
2. Scroll to the bottom and click **Connect** next to **Custom provider**.
3. Fill in the form:
   - **Provider ID**: `ppq` (lowercase letters, numbers, hyphens or underscores)
   - **Display name**: `PayPerQ`
   - **Provider API**: **OpenAI Compatible** (the default)
   - **Base URL**: `https://api.ppq.ai`
   - **API key**: `<your PayPerQ API key>`
4. Under **Models**, click **Fetch models**. Kilo loads the PayPerQ model list (several hundred models) and ticks all of them. Click **Deselect all**, search for the models you want (for example `gpt-5.4-nano` for a cheap model, or `claude-sonnet-5.5` for a stronger one), tick them and click **Add model(s)**. Kilo works as a coding agent, so pick models that support tool use. You can browse the current list, with prices, at [api.ppq.ai/v1/models](https://api.ppq.ai/v1/models) (entries whose `supported_parameters` include `tools` work as agents).
5. Click **Submit**. Saving can take a few seconds, then **PayPerQ** appears under **Connected providers**.

![Kilo Code custom provider form](/blog-images/using-kilocode-with-payperq/03-custom-provider-form.png)

![Fetched models added](/blog-images/using-kilocode-with-payperq/04-fetched-models-added.png)

### 4. Select a PayPerQ model

This step is easy to miss: after setup, the chat box still uses Kilo's default model, **Auto Free**, which is served through Kilo's own gateway and not through PayPerQ. Click the model button under the chat box, search for the model you added, and choose the entry labelled **PayPerQ** (not the one labelled **Kilo Gateway**). In our test the model list is also navigable with the keyboard: type to filter, use the arrow keys, press Enter.

![Pick the PayPerQ entry in the model picker](/blog-images/using-kilocode-with-payperq/05-model-picker-payperq.png)

### 5. Start coding with AI assistance

Type a message in the chat box and press Enter. As a quick check, ask "Reply with the word OK":

![First reply through PayPerQ](/blog-images/using-kilocode-with-payperq/06-first-reply.png)

Then you can use Kilo Code's features:

- **Code Generation**: Ask Kilo Code to write functions, classes, or entire modules
- **Code Explanation**: Get detailed explanations of complex code
- **Refactoring**: Request improvements and optimizations to existing code
- **Debugging**: Get help identifying and fixing bugs
- **Documentation**: Generate comments and documentation automatically

Kilo Code sends a long system prompt with every request (about 16,000 input tokens in our test, even for a one-word question), and its cost display shows $0.00 for custom providers. Check your real spending at [ppq.ai/account-activity](https://ppq.ai/account-activity) and prefer cheaper models for routine tasks.

## Benefits of Using Kilo Code with PayPerQ

- **Cost-effective**: Pay only for what you use with PayPerQ's flexible pricing
- **Multiple Models**: Access various AI models through PayPerQ's unified API

## Problems?

- Kilo answers but nothing shows up in PayPerQ usage: you are probably still on **Auto Free** or a **Kilo Gateway** model. Re-check step 4.
- A "401 Invalid API key" error means the key was copied incorrectly or has been revoked. Check your keys at [ppq.ai/api-keys](https://ppq.ai/api-keys).

Please contact us through the customer communication chatbot in the bottom right of ppq.ai or in our [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh) or on [Discord](https://discord.gg/BmMntEShYg)!
