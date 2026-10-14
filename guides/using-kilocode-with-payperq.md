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

Kilo Code is an open source AI coding agent that runs inside VS Code (it also has a JetBrains plugin and a CLI). It lets you interact with AI models directly in your editor, edit your codebase with natural language commands and get code suggestions. This guide covers the VS Code extension.

## Step by Step Set Up

### 1. Get your PayPerQ API key

Open [ppq.ai/api-docs](https://ppq.ai/api-docs). The "Your API Key" box shows your key (masked) with a copy button, and the "Base URL" box shows `https://api.ppq.ai`. Copy the key. If you want a separate key for Kilo Code, use the "Manage your API keys" link on that page ([ppq.ai/api-keys](https://ppq.ai/api-keys)).

### 2. Install Kilo Code

In VS Code, open the Extensions view and search for "Kilo Code". Kilo's docs recommend clicking the dropdown arrow next to **Install** and choosing **Install Pre-Release Version**; the "pre-release" label is only a VS Code Marketplace distribution channel and the extension is stable. In VS Code-compatible editors that use Open VSX, search for "Kilo Code" in the extensions view.

After installing, click the Kilo Code icon in the activity bar. You will see a "Welcome to Kilo" screen asking how you want to work ("Review first" or "High autonomy"); you can change this later in Settings.

![Kilo Code welcome screen](/blog-images/using-kilocode-with-payperq/01-kilo-welcome.png)

### 3. Add PayPerQ as a custom provider

Click the gear icon at the top of the Kilo Code panel to open **Settings**, then choose **Providers**.

![Kilo Code settings, Providers tab](/blog-images/using-kilocode-with-payperq/02-settings-providers.png)

Under "Popular providers" find **Custom provider** ("Add a custom provider by base URL") and click **Connect**.

![Custom provider dialog](/blog-images/using-kilocode-with-payperq/03-custom-provider-dialog.png)

Fill in the dialog:

- **Provider ID**: `ppq` (lowercase letters, numbers, hyphens or underscores)
- **Display name**: `PayPerQ`
- **Provider API**: `OpenAI Compatible` (the default)
- **Base URL**: `https://api.ppq.ai`
- **API key**: `<your PayPerQ API key>` (the field is masked)

Click **Fetch models**. Kilo loads the list of PayPerQ models (hundreds of them). Use the search box to find the model you want, tick it and click **Add 1 model(s)**, for example `anthropic/claude-haiku-5.5` (inexpensive) or `anthropic/claude-sonnet-5`. You can see all available model IDs at [api.ppq.ai/v1/models](https://api.ppq.ai/v1/models); pick one that supports tools, because Kilo Code is a coding agent. Then click **Submit**.

![Custom provider dialog filled in](/blog-images/using-kilocode-with-payperq/04-custom-provider-filled.png)

### 4. Select the PayPerQ model in the chat

Saving the provider does not switch the chat to it. At the bottom of the Kilo Code panel the model selector still shows a Kilo Gateway model (for example "Auto Free"). Click it, type `PayPerQ` in "Search models", and select your PayPerQ model.

![Choosing the PayPerQ model in the model picker](/blog-images/using-kilocode-with-payperq/05-model-picker-payperq.png)

If you send a message while a Kilo Gateway model is selected, Kilo shows "You need to sign in to use this model" instead of using your PayPerQ key (and free Kilo Gateway models may log prompts upstream).

### 5. Start coding with AI assistance

Type a message in the Kilo Code box. Try a short prompt first, such as "Reply with the word OK". If you get an authentication error instead, see Troubleshooting below. You can use Kilo Code's AI features:

- **Code Generation**: Ask Kilo Code to write functions, classes, or entire modules
- **Code Explanation**: Get detailed explanations of complex code
- **Refactoring**: Request improvements and optimizations to existing code
- **Debugging**: Get help identifying and fixing bugs
- **Documentation**: Generate comments and documentation automatically

Keep an eye on cost: you pay PayPerQ per token for every request. You can check usage on [ppq.ai/account-activity](https://ppq.ai/account-activity).

## Troubleshooting

- **"Unauthorized" / 401**: PayPerQ rejected the key ("API key not found or has been revoked"). Copy the key again from [ppq.ai/api-docs](https://ppq.ai/api-docs) and update the API key of your PayPerQ provider in Kilo Code Settings -> Providers.
- **"You need to sign in to use this model"**: you are still on a Kilo Gateway model. Select your PayPerQ model (step 4).

## Benefits of Using Kilo Code with PayPerQ

- **Cost-effective**: Pay only for what you use with PayPerQ's flexible pricing
- **Multiple Models**: Access various AI models through PayPerQ's unified API

## Problems?

Please contact us through the customer communication chatbot in the bottom right of ppq.ai, in our [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh) or on [Discord](https://discord.gg/BmMntEShYg).
