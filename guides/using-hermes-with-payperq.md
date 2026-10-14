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

### 1. Get Your PayPerQ API Key

Navigate to [ppq.ai/api-docs](https://ppq.ai/api-docs) and copy your API key. It starts with `sk-`. You can create separate keys for different applications on the [API keys page](https://ppq.ai/api-keys).

### 2. Install the PPQ Plugin

Install the plugin before running the Hermes installer so that PayPerQ appears in the setup wizard:

```bash
# Download the plugin
git clone https://github.com/PayPerQ/ppq-hermes-provider.git

# Pre-install into the Hermes plugins directory
mkdir -p ~/.hermes/plugins/model-providers/ppq
cp -r ppq-hermes-provider/ppq_hermes_provider/. ~/.hermes/plugins/model-providers/ppq/
cp ppq-hermes-provider/plugin.yaml ~/.hermes/plugins/model-providers/ppq/
```

### 3. Install Hermes Agent

The installer needs `git` and `curl`. On a minimal Linux image (for example a bare Ubuntu 24.04 container) you may also need `libatomic1` (`sudo apt-get install -y libatomic1`), otherwise the bundled Node.js fails to start and the install stops with "pm install failed".

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

When the wizard asks **"How would you like to set up Hermes?"**, choose **Full setup — configure every provider, tool & option yourself (bring your own keys)**. Do not pick *Quick Setup*: that option is the Nous Portal login and does not offer PayPerQ.

Then, in the wizard:

1. At **Select provider**, scroll to the bottom of the list (PayPerQ is near the end, just above *Custom endpoint*) and select **PayPerQ — OpenAI-compatible inference API**.
2. Paste your PayPerQ API key at the `PPQ_API_KEY` prompt.
3. Press Enter to accept the default **Base URL** `https://api.ppq.ai/v1`.
4. At **Select default model**, choose **Enter custom model name** and type a model ID from [Some Good Models to Try](#some-good-models-to-try) (for example `moonshotai/kimi-k2.6`). The built-in list shown here is a static list bundled with the plugin and most of its entries are not PayPerQ model IDs, so do not pick from it.
5. Choose a reasoning effort (the default, *medium*, is fine).

The rest of the wizard (terminal backend, messaging platforms, tools, image generation) is optional and unrelated to PayPerQ; answer it as you like or skip it. Hermes stores your choice as `provider: "ppq"` with `base_url: "https://api.ppq.ai/v1"` in `~/.hermes/config.yaml`, and the key as `PPQ_API_KEY` in `~/.hermes/.env`.

### 4. Start Hermes

Open a new terminal (or run `source ~/.bashrc`) so the `hermes` command is on your PATH, then start it:

```bash
hermes
```

To change provider or model later, run:

```bash
hermes model
```

Select **PayPerQ** (it is marked "currently active" when in use), enter your key if asked, and type a model ID.

Prefer no wizard? The plugin also reads `PPQ_API_KEY`, so you can run a one-off prompt with:

```bash
export PPQ_API_KEY=your_key_here
hermes -z "hello" --provider ppq -m moonshotai/kimi-k2.6
```

That's it! Hermes is now configured to use PayPerQ as its AI provider.

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

Scroll down to **PayPerQ**, select it, enter your API key, accept the default Base URL, and choose **Enter custom model name** to type a model ID. Hermes saves everything automatically.

## Some Good Models to Try

PayPerQ gives you access to hundreds of models. Here are some great ones to try with Hermes:

- **moonshotai/kimi-k2.6** - Moonshot AI's advanced multimodal coding model
- **mistralai/devstral-2512** - Mistral AI's development model
- **google/gemini-3-flash-preview** - Google's latest multimodal AI
- **z-ai/glm-4.7** - Z-AI's powerful model
- **minimax/minimax-m2.1** - MiniMax's advanced model
- **x-ai/grok-4.5** - X.AI's Grok model
- **And many more premium models**

## Get the Most Recent Models

Want to see all available models? You can fetch the most up-to-date list directly from PayPerQ's API:

```bash
curl https://api.ppq.ai/v1/models
```

This endpoint returns a JSON list of all currently available models on PayPerQ.

## Verify Your Setup

Once Hermes is running with your PayPerQ configuration, send it a short prompt and check your usage history at [ppq.ai/account-activity](https://ppq.ai/account-activity).

If Hermes answers with `HTTP 401: API key not found or has been revoked`, the request reached PayPerQ but the key is wrong: re-copy it from [ppq.ai/api-docs](https://ppq.ai/api-docs) and run `hermes model` to enter it again.

## Try AutoClaw — Smart Model Routing

Don't want to pick a model yourself? [AutoClaw](/blog/using-autoclaw-with-payperq) is our intelligent router that automatically selects the best model for each prompt — saving you money on simple questions while using top-tier models when it matters. You can enter `autoclaw` as your model name (it exists in the PayPerQ catalog), but the catalog does not list tool-calling (`tools`) support for it and we have not verified it with Hermes's tool calls, so try it on a simple task first.

## Private Models

Want maximum privacy? PayPerQ offers [TEE (Trusted Execution Environment) models](/blog/using-private-tee-models-with-openclaw) that encrypt your queries so neither PayPerQ nor anyone else can read them. Available private models include:

- **private/kimi-k3** - Recommended for agentic tasks
- **private/gpt-oss-120b** - Budget-friendly general use
- **private/llama3-3-70b** - Fast
- **private/glm-5-3** - Agentic engineering, long-horizon tool use, 1M context
- **private/gemma4-31b** - Vision-language with built-in thinking mode
- **private/deepseek-v4-1-flash** - Multimodal refresh with vision input, 1M context

The [PPQ Privacy Verifier](https://github.com/PayPerQ/ppq-privacy-verifier) is an optional local proxy that lets you verify the enclave yourself before your requests leave your machine. See the [full guide](/blog/using-private-tee-models-with-openclaw) for setup instructions. Note that the catalog does not list tool-calling (`tools`) support for these private models, so they may not work as Hermes's main model for agentic tasks.

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

Please contact us through the customer communication chatbot in the bottom right or in our [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh) or on [Discord](https://discord.gg/BmMntEShYg)!
