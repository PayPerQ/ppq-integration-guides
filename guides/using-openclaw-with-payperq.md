---
title: Using OpenClaw with PayPerQ
slug: using-openclaw-with-payperq
date: 2026-10-14
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

### 1. Install OpenClaw

Install OpenClaw from the [official site and repository](https://github.com/openclaw/openclaw). On macOS, Linux or WSL2 run:

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

On Windows (PowerShell):

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

If you already manage Node.js yourself (Node 24.16+ or 26.1+), you can use `npm install -g openclaw@latest --allow-scripts=openclaw` instead.

**Tip:** If `openclaw` is "command not found" right after installing, open a new terminal window (or run `source ~/.bashrc; hash -r`).

### 2. Get Your PayPerQ API Key

Navigate to [ppq.ai/api-docs](https://ppq.ai/api-docs) and copy your API key. It starts with `sk-`. The same page shows the base URL you need: `https://api.ppq.ai`. You can create separate keys for different apps at [ppq.ai/api-keys](https://ppq.ai/api-keys).

### 3. Add PayPerQ in the OpenClaw Setup Wizard

The installer starts OpenClaw's setup wizard automatically (you can run it again any time with `openclaw onboard`). Accept the security notice, answer the questions about telemetry and your first agent as you like, and when asked how to set things up choose to configure your AI access manually. Then:

1. In the **Model/auth provider** list choose **More…**, then **Custom Provider**.
2. **API Base URL:** `https://api.ppq.ai`
3. **How do you want to provide this API key?** Choose **Paste API key now** and paste `<your PayPerQ API key>` (the field is masked).
4. **Endpoint compatibility:** **OpenAI-compatible** (uses `/chat/completions`).
5. **Model ID:** `claude-sonnet-5.5`
6. **Endpoint ID:** accept the default (`custom-api-ppq-ai`). Leave the model alias empty.

OpenClaw then sends a short test request and shows an `Inference verified: custom-api-ppq-ai/...` box when PayPerQ answered. Let the wizard finish (it also installs the background gateway service where your system supports it).

### 4. Start the Gateway and Say Hello

If the wizard installed the gateway service, restart it to be sure the configuration is loaded:

```bash
openclaw gateway restart
```

If your system has no background service support (for example inside a Docker container), run the gateway in the foreground instead: `openclaw gateway run`.

Then open the terminal chat and send a message:

```bash
openclaw tui
```

The footer shows the model in use (for example `claude-sonnet-5.5`). Type `Reply with the word OK` and you should get an answer from PayPerQ.

![OpenClaw terminal chat answering through PayPerQ](/blog-images/using-openclaw-with-payperq/01-tui-first-reply.png)

## Alternative: Edit the Config File Yourself

Instead of the wizard's Custom Provider screen you can describe PayPerQ in `~/.openclaw/openclaw.json`. Run the setup wizard (`openclaw onboard`) at least once first, because it creates the gateway settings OpenClaw needs to start. Then merge the following fields into your existing config rather than replacing it:

**Tip:** The `~/.openclaw/` folder is hidden by default. On macOS, press `Cmd + Shift + .` in Finder to show hidden files.

```json
{
  "env": {
    "vars": {
      "PPQ_API_KEY": "<your PayPerQ API key>"
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
            "id": "claude-sonnet-5.5",
            "name": "Claude Sonnet 5.5"
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": "ppq/claude-sonnet-5.5"
    }
  }
}
```

**Important:** Replace `<your PayPerQ API key>` with your actual key from [ppq.ai/api-docs](https://ppq.ai/api-docs). Note that the key belongs under `env.vars` (a plain `env.PPQ_API_KEY` is rejected by current OpenClaw versions), and that `agents.defaults.model` (`ppq/` followed by the model ID) is what makes OpenClaw use PayPerQ by default. Check the file with `openclaw config validate`, then restart the gateway (step 4).

Models you add by hand use OpenClaw's defaults of a 128k context window and 4096 output tokens; you can set `contextWindow` and `maxTokens` per model if you need more.

## Some Good Models to Try

We recommend using Anthropic Sonnet models for this tool (`claude-sonnet-5.5`; `claude-opus-5.5` for the hardest tasks). These tool-capable coding friendly models may work as well:

- **moonshotai/kimi-k2.6** - Moonshot AI's advanced multimodal coding model
- **mistralai/devstral-2512** - Mistral AI's development model
- **google/gemini-3-flash-preview** - Google's multimodal AI
- **z-ai/glm-5.3-flash** - Z-AI's fast, low-cost model
- **minimax/minimax-m3** - MiniMax's advanced model
- **x-ai/grok-4.7** - X.AI's model
- **And many more premium models**

## Get the Most Recent Models

Want to see all available models? You can fetch the most up-to-date list directly from PayPerQ's API:

```bash
curl https://api.ppq.ai/v1/models
```

This endpoint returns a JSON list of all currently available models on PayPerQ. For coding agents like OpenClaw, pick a model whose `supported_parameters` include `tools`.

## Verify Your Setup

Once OpenClaw is running with your PayPerQ configuration, you can verify requests are being processed by checking your usage history at [ppq.ai/account-activity](https://ppq.ai/account-activity).

## Try AutoClaw — Smart Model Routing

Don't want to pick a model yourself? [AutoClaw](/blog/using-autoclaw-with-payperq) is our intelligent router that automatically selects the best model for each prompt — saving you money on simple questions while using top-tier models when it matters.

## Problems?

Please contact us through the customer communication chatbot in the bottom right or in our [telegram channel](https://t.me/+ZjJDTazIrV0zNDFh)!
