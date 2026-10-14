---
title: AutoClaw Smart Routing — Automatically pick the best model for your OpenClaw
slug: using-autoclaw-with-payperq
date: 2026-10-14
image: /blog-images/using-autoclaw-with-payperq/autoclaw.png
ogImage: /blog-images/using-autoclaw-with-payperq/autoclaw.png
intro: AutoClaw is a smart routing model that analyzes your OpenClaw prompts and automatically picks the right AI model — cutting costs by up to 70%.
author: Matt Ahlborg
tags:
  - Features
---

## What is AutoClaw?

AutoClaw is our intelligent model router designed for OpenClaw users. It solves a simple problem: why pay $25 per million tokens for a top-tier model when your question is "what is 2+2?"

Instead of forcing you to choose a single model or build your own system, AutoClaw analyzes your prompt in under 1 millisecond and routes it to the best model for the job. Simple questions go to fast, cheap models. Complex reasoning tasks go to powerful ones. You get the right model for the right job, every time.

## How It Works

AutoClaw scores your prompt across 15 weighted dimensions — including code detection, reasoning complexity, technical vocabulary, multi-step patterns, and more — then classifies it into one of four tiers:

- **Simple** — factual questions, translations, definitions → routed to fast, affordable models
- **Medium** — general coding, writing, moderate tasks → routed to capable all-rounders
- **Complex** — architecture design, multi-step analysis, advanced coding → routed to top-tier models
- **Reasoning** — mathematical proofs, formal logic, step-by-step derivations → routed to specialized reasoning models

The entire classification runs on PPQ servers with zero external API calls — it adds no latency to your requests. Prompts with multiple reasoning keywords (like "prove" and "step by step") are automatically escalated to the Reasoning tier with high confidence.

### Current Model Assignments (September 2026)

| Tier | Auto | Eco | Premium |
|------|------|-----|---------|
| **Simple** | GLM 5.3 Flash | GLM 5.3 Flash | Claude Sonnet 5 |
| **Medium** | GLM 5.3 | GLM 5.3 Flash | Claude Sonnet 5 |
| **Complex** | Claude Sonnet 5 | GLM 5.3 | Claude Opus 5 |
| **Reasoning** | Claude Opus 5 | GLM 5.3 | Claude Opus 5 |

These assignments are updated by PayPerQ as new models are released — you always get the latest and best without changing your configuration. The table reflects September 2026; the mapping is set on the PayPerQ side and newer models (for example `claude-opus-5.5`) may have been added since, so treat the table as a snapshot. You can see which models exist with `curl https://api.ppq.ai/v1/models`.

## Key Capabilities

- **15-dimension prompt analysis** covering code, reasoning, technical depth, creativity, constraints, and more
- **Sub-millisecond routing** — no latency added to your requests
- **Multilingual support** — keyword detection in English, Chinese, Japanese, Russian, and German
- **Three routing profiles** — auto (balanced), eco (cheapest), and premium (best quality)
- **Agentic mode detection** — automatically identifies multi-step agent tasks and routes accordingly
- **Always up to date** — PayPerQ keeps the tier model assignments current with the latest and best models, so you don't have to worry about updating your configuration as new models launch

## How to Use on PayPerQ

![How to use AutoClaw on PayPerQ](/blog-images/using-autoclaw-with-payperq/howto.png)

AutoClaw is available through the PayPerQ API. Set your model to `autoclaw` in any OpenAI-compatible request:

```bash
curl https://api.ppq.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-YOUR_API_KEY" \
  -d '{
    "model": "autoclaw",
    "messages": [{"role": "user", "content": "What is the capital of France?"}]
  }'
```

### Routing Profiles

| Profile | Model ID | Best For |
|---------|----------|----------|
| **Auto** | `autoclaw` or `autoclaw/auto` | Balanced quality and cost (default) |
| **Eco** | `autoclaw/eco` | Maximum cost savings |
| **Premium** | `autoclaw/premium` | Best quality for every tier |

### Custom Model Lists — Bring Your Own Four Models

Don't want to use one of the built-in profiles? You can supply your own models and let the same AutoClaw engine score your prompts and route them through your picks. Use the `autorouter/` prefix followed by a comma-separated list of exactly four model slugs:

```bash
curl https://api.ppq.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-YOUR_API_KEY" \
  -d '{
    "model": "autorouter/minimax/minimax-m3,z-ai/glm-5.2,anthropic/claude-sonnet-5,anthropic/claude-opus-5",
    "messages": [{"role": "user", "content": "What is the capital of France?"}]
  }'
```

The four models above are an arbitrary illustration, not the built-in defaults — any four models from the PayPerQ catalog work, and the whole point of `autorouter/` is picking a ladder that differs from the profiles in the table earlier in this post.

The list is **positional** — left-to-right maps directly onto the four AutoClaw tiers:

| Position | Tier | In the example above |
|----------|------|----------------------|
| 1st | Simple | `minimax/minimax-m3` |
| 2nd | Medium | `z-ai/glm-5.2` |
| 3rd | Complex | `anthropic/claude-sonnet-5` |
| 4th | Reasoning | `anthropic/claude-opus-5` |

Put your cheapest/fastest model first and your most capable model last. AutoClaw scores each incoming prompt the same way as the built-in profiles, then forwards it to whichever slot you've assigned.

**Rules to keep in mind:**

- **Exactly four models required.** Any other count — empty, 1, 2, 3, or 5+ — falls back to the default `autoclaw/auto` profile. There is no fuzzy distribution across an incomplete list.
- **Order is the assignment.** `autorouter/A,B,C,D` is not the same as `autorouter/D,C,B,A`. The first entry handles simple prompts, the last entry handles reasoning.
- **Slugs or short aliases accepted.** Each entry can be a canonical provider slug (`anthropic/claude-opus-5`, `minimax/minimax-m3`) or a PayPerQ short model ID (`claude-opus-5.5`, `glm-5.3`). Look up valid IDs with `curl https://api.ppq.ai/v1/models`.
- **Unknown entries pass through.** Typos or unrecognized slugs aren't rejected up front — they're forwarded upstream as-is and may return a 404 if the selected tier happens to route to one.

### Using with OpenClaw

You need OpenClaw installed and its first-run onboarding finished. If you don't have it yet, the official installer is:

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

It installs OpenClaw and then starts the onboarding wizard. Complete it before continuing; the gateway won't start on a config that has no `gateway.mode` set. See [Using OpenClaw with PayPerQ](/blog/using-openclaw-with-payperq) for the full walkthrough.

Then get your API key from [ppq.ai/api-docs](https://ppq.ai/api-docs) and add the following to your `~/.openclaw/openclaw.json`:

```json
{
  "env": {
    "vars": {
      "PPQ_API_KEY": "sk-YOUR_API_KEY_HERE"
    }
  },
  "models": {
    "mode": "merge",
    "providers": {
      "ppq": {
        "baseUrl": "https://api.ppq.ai",
        "apiKey": "${PPQ_API_KEY}",
        "api": "openai-completions",
        "models": [
          {
            "id": "autoclaw",
            "name": "autoclaw"
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "ppq/autoclaw"
      }
    }
  }
}
```

**Important:** Replace `sk-YOUR_API_KEY_HERE` with your actual PayPerQ API key from [ppq.ai/api-docs](https://ppq.ai/api-docs). If you already have an `openclaw.json` with other settings, merge these fields into your existing config rather than replacing it.

**Note:** Current OpenClaw versions only accept environment variables under `env.vars`. A config that puts `PPQ_API_KEY` directly under `env` (the layout older versions of this guide showed) is rejected with `env: Unrecognized key: "PPQ_API_KEY"`. If you see that error, either move the key under `vars` as shown above, or run `openclaw doctor --fix`, which moves it for you.

Check that OpenClaw accepts the file:

```bash
openclaw config validate
```

It should answer `Config valid`. Then restart the gateway:

```bash
openclaw gateway restart
```

`openclaw gateway restart` restarts the installed gateway service (launchd, systemd or Windows scheduled task). If you run the gateway in the foreground instead, for example inside a container without systemd, stop it and start it again with `openclaw gateway run`.

Finally, confirm the model is registered:

```bash
openclaw models list
```

`ppq/autoclaw` should appear in the list and be tagged `default`. Send a prompt (for example with `openclaw tui`) and check your usage at [ppq.ai/account-activity](https://ppq.ai/account-activity).

## New to OpenClaw?

If you haven't set up OpenClaw with PayPerQ yet, check out our guide: [Using OpenClaw with PayPerQ](/blog/using-openclaw-with-payperq). It walks you through downloading OpenClaw, getting your API key, and configuring it to use PayPerQ's hundreds of AI models — all in just a few minutes.

## Problems?

Ask the customer chatbot at the bottom right of [ppq.ai](https://ppq.ai), or reach us on [Telegram](https://t.me/+ZjJDTazIrV0zNDFh) or [Discord](https://discord.gg/BmMntEShYg).

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

## Credits

AutoClaw's routing engine is based on [ClawRouter](https://github.com/BlockRunAI/ClawRouter), an open-source smart LLM router, with additional tweaks and model configurations tailored for the PayPerQ platform and its users.