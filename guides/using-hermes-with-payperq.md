---
title: Using Hermes Agent with PayPerQ
slug: using-hermes-with-payperq
date: 2026-04-20
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

Navigate to [ppq.ai/api-docs](https://ppq.ai/api-docs) and copy your API key. It starts with `sk-`.

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

Now install Hermes. Because the plugin is already in place, **PayPerQ will appear in the provider list** during the setup wizard:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

When the wizard asks **"How would you like to set up Hermes?"**, select **Quick setup**.

### 4. Select PayPerQ as Your Provider

Once the installation finishes, open the model picker:

```bash
hermes model
```

Scroll down to **PayPerQ**, select it, and enter your API key when prompted. Hermes will fetch the live model catalog and ask you to pick a model. Choose one and you're ready to go.

That's it! Hermes is now configured to use PayPerQ as its AI provider.

## Already Have Hermes Installed?

If Hermes is already running on your machine, you don't need to reinstall it. Just follow these three steps:

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

Scroll down to **PayPerQ**, select it, and enter your API key when prompted. Hermes saves it automatically. That's all — no restart needed.

## Some Good Models to Try

PayPerQ gives you access to hundreds of models. Here are some great ones to try with Hermes:

- **moonshotai/kimi-k2.6** - Moonshot AI's advanced multimodal coding model
- **mistralai/devstral-2512** - Mistral AI's development model
- **kwaipilot/kat-coder-pro** - Kwaipilot's professional coding model
- **google/gemini-3-flash-preview** - Google's latest multimodal AI
- **z-ai/glm-4.7** - Z-AI's powerful model
- **minimax/minimax-m2.1** - MiniMax's advanced model
- **x-ai/grok-code-fast-1** - X.AI's rapid coding model
- **And many more premium models**

## Get the Most Recent Models

Want to see all available models? You can fetch the most up-to-date list directly from PayPerQ's API:

```bash
curl https://api.ppq.ai/v1/models
```

This endpoint returns a JSON list of all currently available models on PayPerQ.

## Verify Your Setup

Once Hermes is running with your PayPerQ configuration, you can verify requests are being processed by checking your usage history at [ppq.ai/account-activity](https://ppq.ai/account-activity).

## Try FireRouter — One Model Id, Routed Per Turn

Don't want to pick a model yourself? [FireRouter](https://ppq.ai/blog/firerouter-on-payperq) picks the model for every turn — Claude Opus for the hardest problems, frontier open-weight models for everything else — and you pay the price of the model that answered. It works on the PayPerQ API side, so it's fully compatible with Hermes — just use `firerouter` as your model name.

## Private Models

Want maximum privacy? PayPerQ offers [TEE (Trusted Execution Environment) models](/blog/using-private-tee-models-with-openclaw) that encrypt your queries so neither PayPerQ nor anyone else can read them. Available private models include:

- **private/kimi-k3** - Recommended for agentic tasks
- **private/gpt-oss-120b** - Budget-friendly general use
- **private/llama3-3-70b** - Fast
- **private/glm-5-3** - Agentic engineering, long-horizon tool use, 1M context
- **private/glm-5-3-flash** - Fast, low-cost vision + reasoning, 1M context
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

Please contact us through the customer communication chatbot in the bottom right or in our telegram channel!
