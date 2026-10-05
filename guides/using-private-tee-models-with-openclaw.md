---
title: How to use PPQ's Private (TEE) AI models via our API and with OpenClaw
slug: using-private-tee-models-with-openclaw
date: 2026-03-06
image: /blog-images/using-private-tee-models-with-openclaw/openclaw_private_mode.webp
ogImage: /blog-images/using-private-tee-models-with-openclaw/openclaw_private_mode.webp
intro: You can now use PPQ.AI's private encrypted models via API or in OpenClaw.
author: Matt Ahlborg
tags:
  - Third Party Integrations
  - Privacy
---

## What are "TEE" AI models?

TEE (Trusted Execution Environment) AI models allow users to run AI queries in the cloud and on remote servers without those servers having access to the content of the users' queries. This delivers one of the best AI capability to privacy tradeoffs in the industry currently.

## How to leverage these models using PPQ?

The trick in using private models is that you need to encrypt the content of your request before sending them onto PPQ and its AI provider. With our proxy repo below, you encrypt the queries on your machine before they leave -- neither PPQ.AI nor anyone else can read them. To get started, head over to the plugin's GitHub page for full installation and configuration instructions:

## [→ github.com/PayPerQ/ppq-private-mode-proxy](https://github.com/PayPerQ/ppq-private-mode-proxy)

The proxy in the repo supports both standalone use cases with your own custom code as well as usage inside of openclaw.

## Using private models with Claude Code

The proxy also exposes a native Anthropic endpoint (`/v1/messages`), so you can use private models directly inside **Claude Code** — including tool use and streaming. Start the proxy, then point Claude Code at it:

```bash
# 1. Start the proxy (leave running)
PPQ_API_KEY=sk-your-key npx ppq-private-mode

# 2. Point Claude Code at the proxy and launch it
export ANTHROPIC_BASE_URL="http://127.0.0.1:8787"
export ANTHROPIC_AUTH_TOKEN="sk-your-key"
export ANTHROPIC_MODEL="private/glm-5-3"
export ANTHROPIC_SMALL_FAST_MODEL="private/glm-5-3-flash"
claude
```

See our [full Claude Code guide](https://ppq.ai/blog/using-claude-code-with-payperq) for VS Code extension setup and more.

## Available Private Models

| Model | Best For |
|-------|----------|
| `private/kimi-k3` | **Recommended.** Moonshot flagship multimodal MoE, reasoning, strong coding, best in openclaw and for agentic tasks |
| `private/gpt-oss-120b` | Budget-friendly general use |
| `private/llama3-3-70b` | Fast |
| `private/glm-5-3` | Agentic engineering, long-horizon tool use, 1M context |
| `private/glm-5-3-flash` | Fast, low-cost vision + reasoning, 1M context |
| `private/gemma4-31b` | Vision-language with built-in thinking mode |
| `private/deepseek-v4-1-flash` | Multimodal refresh with vision input, 1M context |

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

## Questions?

Contact support via the PPQ.AI chatbot at [ppq.ai](https://ppq.ai) or join the Telegram channel for help.
