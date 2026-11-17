---
title: Using OpenBot with PayPerQ
slug: using-openbot-with-payperq
date: 2026-11-17
image: /blog-images/using-openbot-with-payperq/cover.jpg
ogImage: /blog-images/using-openbot-with-payperq/cover.jpg
intro: Run the OpenBot desktop app on pay-per-use PayPerQ models by adding PayPerQ as an OpenAI-compatible endpoint in OpenBot's setup.
author: PayPerQ
tags:
  - Third Party Integrations
---

## What is OpenBot?

OpenBot is an agent workspace from [CopilotKit](https://www.copilotkit.ai): Bots work on tasks for you, use a browser and tools, and ask for your approval before they act. It is open source (the application template is MIT-licensed) and you choose which models the Bots use, including any OpenAI-compatible endpoint.

The desktop app runs on your own computer and combines the OpenBot app with a Docker-based backend. This guide uses the desktop app and its "Connect your AI" setup step to point it at PayPerQ.

## Step by Step Set Up

### 1. Prerequisites

- A PayPerQ account and API key. Copy the key from [ppq.ai/api-docs](https://ppq.ai/api-docs).
- A Mac (Apple silicon or Intel) or a Windows x64 PC, the platforms of the OpenBot desktop installers.
- A CopilotKit account: the desktop setup asks you to sign in to one and says "OpenBot needs a free license key. Sign in to get one."

### 2. Install OpenBot Desktop

Download the installer for your computer from [open.bot](https://open.bot) (Mac Apple Silicon, Mac Intel or Windows) and run it.

> **Note:** the OpenBot README describes the installers as a "Notarized .dmg for Apple silicon and Intel Macs" and a "signed installer for Windows x64", with "no terminal or developer tools needed".

### 3. Start the setup

Open OpenBot. The first screen is **Set up OpenBot**. Click **Install**, then follow the next screens in order: sign in to your CopilotKit account in the browser window that opens and accept the local evaluation agreement. The app installs its container engine and local software on the way; wait until the **Connect your AI** screen appears.

### 4. Add PayPerQ as your AI provider

On the **Connect your AI** screen, you add PayPerQ as an OpenAI-compatible endpoint:

1. **Model provider:** choose the compatible endpoint option (the tile for any endpoint that speaks the OpenAI API), not a provider's own plan or API key tile.
2. **Base URL:** type `https://api.ppq.ai/v1`.
3. **Model name:** type the ID of a model from the [PayPerQ catalog](https://api.ppq.ai/v1/models) whose `supported_parameters` include `tools`. Copy the `id` exactly as the catalog shows it.
4. **API key, if the endpoint needs one:** paste `<your PayPerQ API key>`. The field is masked, and OpenBot keeps the key in your operating system's protected credential store, not in a settings file.
5. Click **Continue**. OpenBot connects to its local Intelligence service, starts, and opens the workspace.

> **Note:** the catalog's format is different from OpenBot's: OpenBot needs just the catalog's `id` field as the model name, and it reads the model list from the endpoint's `/models` itself.

> **Note:** OpenBot's docs say a Bot needs a model with tool calling to drive its computer, and that not every catalogue entry accepts tools. Pick a model that lists `tools`.

### 5. Check the model

Open the Personal Assistant Bot and open the model picker in the message box. It lists the models the endpoint offers; select the model you entered in step 4 if it is not already selected.

### 6. Send a test prompt

In the Personal Assistant chat, type:

```
Reply with the word OK
```

The Bot's reply appears in the chat.

Setup is complete. Check what each request cost on [ppq.ai/account-activity](https://ppq.ai/account-activity). To use another model, open the model picker in the message box, or return to the **Connect your AI** step in settings and change the model name.

### Troubleshooting

**Start is refused after you press Continue on "Connect your AI".** The setup could not start OpenBot with the AI you entered. Fix: return to the **Connect your AI** step, correct the Base URL (`https://api.ppq.ai/v1`), the model name (an `id` from the catalog) or the key, and press Continue again. The OpenBot docs say that after a refused Start "the person comes back here and changes it".

**The Bot does not act or use its tools.** Cause: the model has no tool-call support, which shows as no `tools` in its `supported_parameters` in the catalog. Fix: choose another model whose entry lists `tools`.

## Problems?

Please contact us through the customer communication chatbot in the bottom right of the PayPerQ site, in our [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh) or on [Discord](https://discord.gg/BmMntEShYg).

This guide is open source. If a step no longer works, open [the guide on GitHub](https://github.com/PayPerQ/ppq-integration-guides/blob/main/guides/using-openbot-with-payperq.md) and use the pencil icon to propose a fix, or [open an issue](https://github.com/PayPerQ/ppq-integration-guides/issues); changes go live after a PayPerQ maintainer reviews them.
