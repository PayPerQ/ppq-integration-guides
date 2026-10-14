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

Kilo Code is a VS Code extension that enables AI-powered pair programming by allowing you to interact with AI models directly within your development environment. It helps you edit your codebase using natural language commands and provides intelligent code suggestions.

## Step by Step Set Up

### 1. Get your PayPerQ API key

Go to [ppq.ai/api-docs](https://ppq.ai/api-docs) to find your API key (and the Base URL, `https://api.ppq.ai`). Copy the key. You can create separate keys for different applications at [ppq.ai/api-keys](https://ppq.ai/api-keys).

![PPQ API](/blog-images/using-kilocode-with-payperq/ppq_api.png)

### 2. Install Kilo Code

In VS Code open the Extensions view, search for "Kilo Code" and install it. Kilo's own install instructions suggest clicking the dropdown arrow next to **Install** and choosing **Install Pre-Release Version** (they say the extension is stable and recommended for all users); the regular stable install works too.

![Kilo Code Extension](/blog-images/using-kilocode-with-payperq/01-extension-installed.png)

When you first open the Kilo Code icon in the activity bar, it asks "Choose how you want to work". Pick **Review first** (Kilo asks before editing files or running commands) or **High autonomy**. You can change this later in Settings. You do not need to sign in to Kilo to use your own provider.

![Kilo Code first run](/blog-images/using-kilocode-with-payperq/02-first-run.png)

### 3. Add PayPerQ as a custom provider

Click the gear icon at the top of the Kilo Code panel to open **Settings**, go to the **Providers** tab, scroll down and click **Connect** next to **Custom provider**.

![Kilo Code Providers tab](/blog-images/using-kilocode-with-payperq/03-providers-tab.png)

Fill in the dialog:

- **Provider ID**: `ppq` (lowercase letters, numbers, hyphens or underscores)
- **Display name**: `PayPerQ`
- **Provider API**: `OpenAI Compatible` (the default)
- **Base URL**: `https://api.ppq.ai`
- **API key**: the key you copied from ppq.ai/api-docs

![Kilo Code custom provider dialog](/blog-images/using-kilocode-with-payperq/04-custom-provider.png)

### 4. Add the models you want

In the **Models** section of the same dialog, click **Fetch models**. Kilo loads PayPerQ's full catalog (392 models when we tested) with everything pre-selected, so click **Deselect all**, search for the model you want, tick it and click **Add 1 model(s)**. Good coding models with tool support that are in the PayPerQ catalog include `claude-sonnet-5.5`, `claude-opus-5.5`, `claude-haiku-4.5` and `gpt-5.3-codex`. You can also type a model ID in manually (for example `claude-sonnet-5.5`). Then click **Submit**.

The full, current list is at [api.ppq.ai/v1/models](https://api.ppq.ai/v1/models).

![Kilo Code model list](/blog-images/using-kilocode-with-payperq/05-models.png)

### 5. Select the PayPerQ model and start coding

Kilo Code starts on its own free "Auto Free" model, and adding a provider does not switch to it. Open the model picker at the bottom-left of the chat box, search for your model, hover the entry that says **PayPerQ** and click **Select**. The chat box should now show the model name (for example "Claude Sonnet 5.5").

![Kilo Code model picker](/blog-images/using-kilocode-with-payperq/06-model-picker.png)

Now you can start using Kilo Code's AI features:

- **Code Generation**: Ask Kilo Code to write functions, classes, or entire modules
- **Code Explanation**: Get detailed explanations of complex code
- **Refactoring**: Request improvements and optimizations to existing code
- **Debugging**: Get help identifying and fixing bugs
- **Documentation**: Generate comments and documentation automatically

If the key is wrong, Kilo shows "Unauthorized: API key not found or has been revoked". That message comes from PayPerQ, so re-copy your key from ppq.ai/api-docs and re-enter it under Settings > Providers.

![Kilo Code unauthorized message](/blog-images/using-kilocode-with-payperq/07-unauthorized.png)

### Optional: tool calling and token limits

The dialog does not set context size, output size or tool calling for custom models. Kilo's documentation says to edit the `kilo.jsonc` config file for that (fields `tool_call`, `limit.context`, `limit.output` under `provider.<id>.models.<model>`); see [Kilo's custom models guide](https://kilo.ai/docs/code-with-ai/agents/custom-models).

## Benefits of Using Kilo Code with PayPerQ

- **Cost-effective**: Pay only for what you use with PayPerQ's flexible pricing. Check usage and costs at [ppq.ai/account-activity](https://ppq.ai/account-activity).
- **Multiple Models**: Access various AI models through PayPerQ's unified API

## Problems?

Please contact us through the customer communication chatbot in the bottom right of ppq.ai, in our [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh) or on [Discord](https://discord.gg/BmMntEShYg)!
