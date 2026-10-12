---
title: Using OpenClaw with PayPerQ
slug: using-openclaw-with-payperq
date: 2026-01-30
image: /blog-images/using-openclaw-with-payperq/openclaw.webp
ogImage: /blog-images/using-openclaw-with-payperq/openclaw.webp
intro: Learn how to configure OpenClaw (Clawdbot) to use PayPerQ's API for pay-per-use access to Claude and hundreds of other AI models.
author: Matt Ahlborg
tags:
  - Third Party Integrations
---

## What is OpenClaw?

OpenClaw is an app that can connect to many of your personal apps (whatsapp, telegram, email, slack, many more), and serve as an assistant or agent for many activities and automated tasks.

## Step by Step Configuration

### 1. Download OpenClaw

Download and install OpenClaw from the [official GitHub repository](https://github.com/openclaw/openclaw).

### 2. Get Your PayPerQ API Key

Navigate to [ppq.ai/api-docs](https://ppq.ai/api-docs) and copy your API key. It starts with `sk-`.

### 3. Update Your OpenClaw Config File

Add the `models` attribute to your `~/.openclaw/openclaw.json` file:

**Tip:** The `~/.openclaw/` folder is hidden by default. On macOS, press `Cmd + Shift + .` in Finder to show hidden files. Or run `mkdir -p ~/.openclaw && touch ~/.openclaw/openclaw.json` in Terminal to create the file directly.

```json
{
  "env": {
    "PPQ_API_KEY": "sk-YOUR_API_KEY_HERE"
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
            "id": "claude-opus-4.5",
            "name": "Claude Opus 4.5"
          }
        ]
      }
    }
  }
}
```

**Important:** Replace `sk-YOUR_API_KEY_HERE` with your actual PayPerQ API key from [ppq.ai/api-docs](https://ppq.ai/api-docs). If you already have an `openclaw.json` with other settings, merge these fields into your existing config rather than replacing it.

### 4. Restart the Gateway

Restart the gateway to apply your configuration changes:

```bash
openclaw gateway restart
```

## Some Good Models to Try

We recommend using Anthropic Sonnet models for this tool, but these coding friendly models may work as well:

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

Once OpenClaw is running with your PayPerQ configuration, you can verify requests are being processed by checking your usage history at [ppq.ai/account-activity](https://ppq.ai/account-activity).

## Try FireRouter — One Model Id, Routed Per Turn

Don't want to pick a model yourself? [FireRouter](https://ppq.ai/blog/firerouter-on-payperq) picks the model for every turn — Claude Opus for the hardest problems, frontier open-weight models for everything else — and you pay the price of the model that answered. Set `firerouter` as your model and you're done.

## Problems?

Please contact us through the customer communication chatbot in the bottom right or in our telegram channel!
