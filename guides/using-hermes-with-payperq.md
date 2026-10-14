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

You can learn more at the [Hermes Agent website](https://hermes-agent.nousresearch.com/), browse the [GitHub repository](https://github.com/NousResearch/hermes-agent), or read the [documentation](https://docs.hermes-agent.nousresearch.com).

## Step by Step Configuration

> **Already have Hermes installed?** Skip to [Adding PayPerQ to an existing Hermes installation →](#already-have-hermes-installed)

### 1. Get Your PayPerQ API Key

Navigate to [ppq.ai/api-docs](https://ppq.ai/api-docs) and copy your API key. It starts with `sk-`. You can create separate keys for different applications on the [API keys page](https://ppq.ai/api-keys).

### 2. Install the PPQ Plugin

PayPerQ is added to Hermes through a small provider plugin. The commands below install it before the Hermes installer, which also lists PayPerQ in the wizard's **Full setup**. The order is not required: if you install the plugin afterwards, PayPerQ appears in `hermes model` right away (see step 4).

```bash
# Download the plugin
git clone https://github.com/PayPerQ/ppq-hermes-provider.git

# Pre-install into the Hermes plugins directory
mkdir -p ~/.hermes/plugins/model-providers/ppq
cp -r ppq-hermes-provider/ppq_hermes_provider/. ~/.hermes/plugins/model-providers/ppq/
cp ppq-hermes-provider/plugin.yaml ~/.hermes/plugins/model-providers/ppq/
```

### 3. Install Hermes Agent

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

> **Minimal Linux install?** On a bare Ubuntu/Debian system the installer can fail with `libatomic.so.1: cannot open shared object file`. Run `sudo apt-get install -y libatomic1` and start the installer again.

When the wizard asks **"How would you like to set up Hermes?"**, choose **Full setup** ("configure every provider, tool & option yourself (bring your own keys)").

![The Hermes setup wizard asking how you would like to set up Hermes](/blog-images/using-hermes-with-payperq/01-setup-wizard-choice.png)

Do **not** pick *Quick Setup* — it signs you in to Nous Portal (Nous Research's own service) and never offers PayPerQ. If you already went through Quick Setup, or skipped the provider step, no problem: the next step sets PayPerQ up at any time.

### 4. Select PayPerQ as Your Provider

Once the installation finishes, open the model picker in a new terminal:

```bash
hermes model
```

Scroll down to **PayPerQ — OpenAI-compatible inference API** (it is near the bottom of the list, just above *Local models*) and select it. Hermes then asks, in order:

1. **`PPQ_API_KEY`** — paste your PayPerQ API key. The characters are masked as you type.
2. **`Base URL [https://api.ppq.ai/v1]`** — just press Enter to accept the default.
3. **Select default model** — see the note below.
4. **Select reasoning effort** — pick a level (for example *low* for quick, cheap answers) or *Skip (keep current)*.

![Hermes asking for the PayPerQ API key (masked) and the base URL](/blog-images/using-hermes-with-payperq/02-hermes-model-api-key.png)

**Choosing the model:** the list Hermes shows at this step is a short, built-in list inside the plugin, and most of its entries (for example `gpt-4o`, `gpt-5`, `anthropic/claude-3.7-sonnet`) are not available on PayPerQ. Scroll to the bottom and choose **Enter custom model name**, then type a model ID that exists on PayPerQ, such as `moonshotai/kimi-k2.6` or `gpt-5.4-nano`. See [Some Good Models to Try](#some-good-models-to-try) and [Get the Most Recent Models](#get-the-most-recent-models) below.

![The model picker with the built-in list and the "Enter custom model name" option](/blog-images/using-hermes-with-payperq/03-hermes-model-picker.png)

When it is done you will see `Default model set to: <model> (via PayPerQ)`.

### 5. Start Hermes and Say Hello

```bash
hermes
```

Type a short message such as `Reply with the word OK`. Hermes answers through PayPerQ.

That's it! Hermes is now configured to use PayPerQ as its AI provider.

## Already Have Hermes Installed?

If Hermes is already running on your machine, you don't need to reinstall it. Just follow these steps:

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

Scroll down to **PayPerQ**, select it, and answer the prompts described in [step 4](#4-select-payperq-as-your-provider) above (API key, base URL, model — use **Enter custom model name**, then reasoning effort). Hermes saves everything automatically. That's all — no restart needed.

## Some Good Models to Try

PayPerQ gives you access to hundreds of models. Here are some great ones to try with Hermes (type the ID exactly as shown into **Enter custom model name**):

- **moonshotai/kimi-k2.6** - Moonshot AI's advanced multimodal coding model
- **mistralai/devstral-2512** - Mistral AI's development model
- **google/gemini-3-flash-preview** - Google's fast multimodal model
- **z-ai/glm-4.7** - Z-AI's powerful model
- **minimax/minimax-m2.1** - MiniMax's advanced model
- **gpt-5.4-nano** - a small, low-cost OpenAI model, handy for testing your setup
- **And many more premium models**

## Get the Most Recent Models

Want to see all available models? You can fetch the most up-to-date list directly from PayPerQ's API (no API key needed):

```bash
curl https://api.ppq.ai/v1/models
```

This endpoint returns a JSON list of all currently available models on PayPerQ. Use the `id` of a model from this list as the custom model name in Hermes. Agents like Hermes call tools, so pick a model whose `supported_parameters` include `tools`.

## Verify Your Setup

Once Hermes is running with your PayPerQ configuration, you can verify requests are being processed by checking your usage history at [ppq.ai/account-activity](https://ppq.ai/account-activity).

You can also send a single prompt without opening the interface (replace `<model>` with the model ID you chose):

```bash
hermes -z "Reply with the word OK" --provider ppq -m <model>
```

## Try AutoClaw — Smart Model Routing

Don't want to pick a model yourself? [AutoClaw](/blog/using-autoclaw-with-payperq) is our intelligent router that automatically selects the best model for each prompt — saving you money on simple questions while using top-tier models when it matters. Since AutoClaw works on the PayPerQ API side, you can enter `autoclaw` as the custom model name in Hermes.

## Private Models

Want maximum privacy? PayPerQ offers [TEE (Trusted Execution Environment) models](/blog/using-private-tee-models-with-openclaw) that encrypt your queries so neither PayPerQ nor anyone else can read them. Available private models include:

- **private/kimi-k3** - Recommended for agentic tasks
- **private/gpt-oss-120b** - Budget-friendly general use
- **private/llama3-3-70b** - Fast
- **private/glm-5-3** - Agentic engineering, long-horizon tool use, 1M context
- **private/gemma4-31b** - Vision-language with built-in thinking mode
- **private/deepseek-v4-1-flash** - Multimodal refresh with vision input, 1M context

To use private models with Hermes, you'll need the [PPQ Private Mode Proxy](https://github.com/PayPerQ/ppq-private-mode-proxy). See the [full guide](/blog/using-private-tee-models-with-openclaw) for setup instructions.

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

Please contact us through the customer communication chatbot in the bottom right of [ppq.ai](https://ppq.ai), in our [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh), or on [Discord](https://discord.gg/BmMntEShYg).
