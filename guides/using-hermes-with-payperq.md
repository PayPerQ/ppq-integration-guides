---
title: Using Hermes Agent with PayPerQ
slug: using-hermes-with-payperq
date: 2026-10-14
image: /blog-images/using-hermes-with-payperq/hermes.webp
ogImage: /blog-images/using-hermes-with-payperq/hermes.webp
intro: Learn how to configure Hermes Agent by Nous Research to use PayPerQ's API for pay-per-use access to hundreds of AI models across Telegram, Discord, Slack, and more.
author: Rafael
tags:
  - Third Party Integrations
---

## What is Hermes Agent?

Hermes Agent is an open-source autonomous AI system developed by [Nous Research](https://nousresearch.com/), similar to [OpenClaw](/blog/using-openclaw-with-payperq). It runs persistently on your infrastructure, connecting to platforms like Telegram, Discord, Slack, WhatsApp, Signal, Email, and the command line — serving as a personal AI assistant and task automator across all of them.

Key features include:

- **Persistent memory** — learns from past interactions and builds up knowledge over time
- **Task scheduling** — automate reports, backups, and briefings using natural language
- **Subagent delegation** — spin up isolated subagents for parallel task execution
- **Flexible sandboxing** — supports local, Docker, SSH, Singularity, and Modal backends
- **Extended capabilities** — web search, browser automation, image generation, text-to-speech, and multi-model reasoning

You can learn more at the [Hermes Agent website](https://hermes-agent.nousresearch.com/), browse the [GitHub repository](https://github.com/NousResearch/hermes-agent), or read the [documentation](https://hermes-agent.nousresearch.com/docs/).

## Step by Step Configuration

> **Already have Hermes installed?** Skip to [Adding PayPerQ to an existing Hermes installation →](#already-have-hermes-installed)

Hermes does not ship with PayPerQ built in. PayPerQ provides a small provider plugin that adds it to Hermes' provider list.

### 1. Get Your PayPerQ API Key

Navigate to [ppq.ai/api-docs](https://ppq.ai/api-docs) and copy your API key from the **Your API Key** box. If you want a separate key for Hermes, you can create more at [ppq.ai/api-keys](https://ppq.ai/api-keys).

### 2. Install the PPQ Plugin

Copy the plugin into Hermes' plugin directory:

```bash
# Download the plugin
git clone https://github.com/PayPerQ/ppq-hermes-provider.git

# Install it into the Hermes plugins directory
mkdir -p ~/.hermes/plugins/model-providers/ppq
cp -r ppq-hermes-provider/ppq_hermes_provider/. ~/.hermes/plugins/model-providers/ppq/
cp ppq-hermes-provider/plugin.yaml ~/.hermes/plugins/model-providers/ppq/
```

> The copy is manual on purpose: `hermes plugins install PayPerQ/ppq-hermes-provider` does not work with this plugin's repository layout.

### 3. Install Hermes Agent

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

On a minimal Linux install (for example a bare Ubuntu/Debian container or server image) the installer can fail while setting up Node.js because the `libatomic1` package is missing. If you see `node ... exited 127` or `pm install failed`, install it and re-run the installer:

```bash
sudo apt-get install -y libatomic1
```

When the setup wizard asks **"How would you like to set up Hermes?"** you will see three options:

- **Quick Setup (Nous Portal)** — signs you in to Nous Portal with a browser login. It does **not** offer PayPerQ, so don't pick it for this guide.
- **Full setup** — lets you pick your own provider with your own key. PayPerQ is in this provider list (near the bottom, just above "Local models").
- **Blank Slate** — everything off except the bare minimum.

![Hermes setup wizard: Quick Setup, Full setup, Blank Slate](/blog-images/using-hermes-with-payperq/01-setup-mode.png)

If you'd rather not pick PayPerQ inside the wizard, finish (or exit) the wizard and use `hermes model` in the next step. You can do that at any time.

### 4. Select PayPerQ as Your Provider

Open a new terminal (the installer adds `~/.local/bin` to your `PATH` via `~/.bashrc`) and run:

```bash
hermes model
```

Scroll down to **PayPerQ — OpenAI-compatible inference API** (it is second to last, just above "Local models") and select it.

![hermes model provider list with PayPerQ highlighted](/blog-images/using-hermes-with-payperq/02-provider-picker.png)

Then:

1. Paste your PayPerQ API key at the `PPQ_API_KEY` prompt (the input is masked).
2. At `Base URL [https://api.ppq.ai/v1]`, press Enter to accept the default.
3. Choose a model (see the note below).
4. If asked to select a reasoning effort, pick one or choose **Skip (keep current)**.

![API key prompt (masked) and Base URL prompt](/blog-images/using-hermes-with-payperq/04-base-url.png)

![Default model list](/blog-images/using-hermes-with-payperq/05-model-picker.png)

> **Model list note:** the plugin's current release shows a built-in list of model names instead of PayPerQ's live catalog, and most of those names (for example `gpt-4o` or `gpt-5`) do **not** exist on PayPerQ. Of the entries shown, `openai/gpt-4o-mini` and `deepseek/deepseek-r1` are on PayPerQ. For anything else, choose **Enter custom model name** and type an ID from the [live model list](#get-the-most-recent-models), for example one of the [models below](#some-good-models-to-try).

That's it! Hermes is now configured to use PayPerQ as its AI provider. The first time you run `hermes` it will also ask whether to share anonymous usage metrics; choose whichever option you like.

To test, run `hermes`, and send a short message such as `Reply with the word OK`.

## Already Have Hermes Installed?

If Hermes is already running on your machine, you don't need to reinstall it. Just follow these two steps:

**1. Install the PPQ plugin:**

```bash
git clone https://github.com/PayPerQ/ppq-hermes-provider.git
mkdir -p ~/.hermes/plugins/model-providers/ppq
cp -r ppq-hermes-provider/ppq_hermes_provider/. ~/.hermes/plugins/model-providers/ppq/
cp ppq-hermes-provider/plugin.yaml ~/.hermes/plugins/model-providers/ppq/
```

**2. Switch to PayPerQ:**

```bash
hermes model
```

Scroll down to **PayPerQ**, select it, and enter your API key when prompted (see [step 4](#4-select-payperq-as-your-provider) for the remaining prompts). Hermes saves it automatically. Hermes picks up the plugin without a reinstall, and a running Hermes process finds it on its next provider lookup.

## Some Good Models to Try

PayPerQ gives you access to hundreds of models. Here are some great ones to try with Hermes. Type the ID exactly as shown with **Enter custom model name**:

- **moonshotai/kimi-k2.6** - Moonshot AI's advanced multimodal coding model
- **mistralai/devstral-2512** - Mistral AI's development model
- **google/gemini-3-flash-preview** - Google's latest multimodal AI
- **z-ai/glm-4.7** - Z-AI's powerful model
- **minimax/minimax-m2.1** - MiniMax's advanced model
- **And many more premium models**

## Get the Most Recent Models

Want to see all available models? You can fetch the most up-to-date list directly from PayPerQ's API:

```bash
curl https://api.ppq.ai/v1/models
```

This endpoint returns a JSON list of all currently available models on PayPerQ. Hermes works best with models that list `tools` under `supported_parameters`.

## Verify Your Setup

Once Hermes is running with your PayPerQ configuration, you can verify requests are being processed by checking your usage history at [ppq.ai/account-activity](https://ppq.ai/account-activity).

If Hermes answers with `HTTP 401: API key not found or has been revoked`, the key was not accepted: copy it again from [ppq.ai/api-docs](https://ppq.ai/api-docs) and re-run `hermes model`.

## Try AutoClaw — Smart Model Routing

Don't want to pick a model yourself? [AutoClaw](/blog/using-autoclaw-with-payperq) is our intelligent router that automatically selects the best model for each prompt — saving you money on simple questions while using top-tier models when it matters. Since AutoClaw works on the PayPerQ API side, it is designed to work with Hermes — just use `autoclaw` as your model name (via **Enter custom model name**).

## Private Models

Want maximum privacy? PayPerQ offers [TEE (Trusted Execution Environment) models](/blog/using-private-tee-models-with-openclaw) that encrypt your queries so neither PayPerQ nor anyone else can read them. Available private models include:

- **private/kimi-k3** - Recommended for agentic tasks
- **private/gpt-oss-120b** - Budget-friendly general use
- **private/llama3-3-70b** - Fast
- **private/glm-5-3** - Agentic engineering, long-horizon tool use, 1M context
- **private/gemma4-31b** - Vision-language with built-in thinking mode
- **private/deepseek-v4-1-flash** - Multimodal refresh with vision input, 1M context

To use private models with Hermes, you'll need the [PPQ privacy verifier proxy](https://github.com/PayPerQ/ppq-privacy-verifier) (formerly the PPQ Private Mode Proxy). See the [full guide](/blog/using-private-tee-models-with-openclaw) for setup instructions.

## What is PayPerQ?

![PayPerQ](/ppqai-opengraph-banner.png)

PayPerQ is a pay-per-query AI service that gives you instant access to hundreds of chat, image, video, and audio AI models in one place. Unlike traditional ChatGPT subscription that charges $20+ per month, PPQ users pay only for what they use—averaging just $4 a month.

Account registration optional. No monthly commitments. Privacy focused. Credit cards and all major cryptos accepted. Just top up with as little as 10 cents and start using premium AI immediately.

### Why Use PayPerQ?

- **Access hundreds of AI models** from all major providers in one place
- **Pay per use** - no subscriptions, no wasted money on unused credits
- **No registration required** - start using AI in seconds
- **Start small** - top up with as little as 10 cents
- **Privacy-first** - conversational data stored locally by default
- **Average cost: ~1 cent per query**

## Getting Started

1. Visit [ppq.ai](https://ppq.ai)
2. Top up your balance (crypto or credit card, as little as 10 cents)
3. Select your model and start chatting

No account creation needed—just fund and go.

## Problems?

Please contact us through the customer communication chatbot in the bottom right of [ppq.ai](https://ppq.ai), in our [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh), or on [Discord](https://discord.gg/BmMntEShYg)!
