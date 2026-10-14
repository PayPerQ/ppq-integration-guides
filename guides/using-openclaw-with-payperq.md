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

OpenClaw's [official GitHub repository](https://github.com/openclaw/openclaw) recommends the install script. It needs Node.js 24.16+ or 26.1+ (Node 26 recommended) and installs Node for you if it is missing.

**macOS / Linux / WSL2:**

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

**Windows (PowerShell):**

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

If you already manage Node yourself you can instead run `npm install -g openclaw@latest --allow-scripts=openclaw` and then `openclaw onboard --install-daemon`. See the [OpenClaw getting started docs](https://docs.openclaw.ai/start/getting-started) for other options.

The installer starts OpenClaw's setup wizard automatically. If `openclaw` is "command not found" afterwards, open a new terminal (or run `source ~/.bashrc; hash -r`).

![OpenClaw setup wizard start screen](/blog-images/using-openclaw-with-payperq/01-wizard-start.png)

### 2. Get Your PayPerQ API Key

Navigate to [ppq.ai/api-docs](https://ppq.ai/api-docs) and copy your API key from the "Your API Key" box. The same page shows the Base URL, `https://api.ppq.ai`. You can create a separate key for OpenClaw on the [API keys page](https://ppq.ai/api-keys).

### 3. Connect OpenClaw to PayPerQ

OpenClaw has no built-in "PayPerQ" provider, so you add PayPerQ as an OpenAI-compatible **custom provider**. You can do this in the setup wizard (option A) or by editing the config file (option B).

#### Option A: In the setup wizard

During the wizard (or any time with `openclaw onboard`) choose these answers. Your first answers (agent name, "Ask first" or "Full access", telemetry) are up to you:

1. **Model/auth provider:** choose **More…**, then **Custom Provider** (Any OpenAI or Anthropic compatible endpoint). You can type `custom` to search the list.
2. **API Base URL:** `https://api.ppq.ai`
3. **How do you want to provide this API key?** **Paste API key now**, then paste `<your PayPerQ API key>` (the field is masked).
4. **Endpoint compatibility:** **OpenAI-compatible** (Uses /chat/completions)
5. **Model ID:** for example `claude-sonnet-5.5` (any ID from the [model list](https://api.ppq.ai/v1/models))
6. **Endpoint ID** and **Model alias:** press Enter to accept the defaults.

![Custom Provider step with PayPerQ base URL and masked API key](/blog-images/using-openclaw-with-payperq/02-wizard-custom-provider-key.png)

If you see "Authentication failed", PayPerQ rejected the key (HTTP 401). Check that you copied the whole key.

#### Option B: Edit the config file

OpenClaw reads `~/.openclaw/openclaw.json`. The setup wizard creates it. If you skipped the wizard, create it with `mkdir -p ~/.openclaw && touch ~/.openclaw/openclaw.json`. On macOS, press `Cmd + Shift + .` in Finder to show the hidden `~/.openclaw` folder.

Add the `env`, `models` and `agents` entries below. If you already have an `openclaw.json`, **merge** these into your existing config rather than replacing it. OpenClaw rejects unknown keys, so keep the exact names:

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
      "model": {
        "primary": "ppq/claude-sonnet-5.5"
      }
    }
  }
}
```

**Important:** Replace `<your PayPerQ API key>` with your actual PayPerQ API key from [ppq.ai/api-docs](https://ppq.ai/api-docs). The key is the value of `PPQ_API_KEY` under `env.vars` (not directly under `env`).

What the pieces do:

- `models.providers.ppq` defines the PayPerQ provider. Every model you want to use must be listed in its `models` array by `id`.
- `agents.defaults.model.primary` selects the model OpenClaw actually uses, written as `ppq/<model id>`. Adding the provider alone does not make it the default; confirm with `openclaw models list` that the model tagged `default` starts with `ppq/`.
- If the model ID itself contains a `/`, keep it in the ref after the provider name, for example `ppq/google/gemini-3-flash-preview`.

Check that the file is valid:

```bash
openclaw config validate
```

### 4. Restart the Gateway

OpenClaw's Gateway watches `openclaw.json` and applies most changes by itself. To be sure the changes are applied, restart it:

```bash
openclaw gateway restart
```

`openclaw gateway restart` only works when the Gateway runs as a background service. If it says "Gateway service disabled", install the service once with `openclaw gateway install`, or run the Gateway in the foreground with `openclaw gateway run` (for example in a container or on a system without systemd).

### 5. Send a Test Message

Open a chat and send a short message such as "Reply with the word OK":

```bash
openclaw chat
```

(or open the browser interface with `openclaw dashboard`). The footer of the chat shows the active model. To list the models OpenClaw knows about, run `openclaw models list`; your PayPerQ models appear as `ppq/<model id>`.

![openclaw config validate and models list](/blog-images/using-openclaw-with-payperq/04-config-valid-models-list.png)

If the answer is "Couldn't sign in to the AI service", PayPerQ rejected the key (HTTP 401). Check the key, or run `openclaw configure` to enter it again.

## Some Good Models to Try

We recommend using Anthropic Sonnet models for this tool (for example `claude-sonnet-5.5`), but these coding friendly models may work as well. To use one, add it to the `models` array of the `ppq` provider and set `agents.defaults.model.primary` to `ppq/<id>`:

- **moonshotai/kimi-k2.6** - Moonshot AI's advanced multimodal coding model
- **mistralai/devstral-2512** - Mistral AI's development model
- **google/gemini-3-flash-preview** - Google's latest multimodal AI
- **z-ai/glm-4.7** - Z-AI's powerful model
- **minimax/minimax-m2.1** - MiniMax's advanced model
- **And many more premium models**

OpenClaw runs tools, so pick a model whose `supported_parameters` include `tools` in the model list below.

## Get the Most Recent Models

Want to see all available models? You can fetch the most up-to-date list directly from PayPerQ's API:

```bash
curl https://api.ppq.ai/v1/models
```

This endpoint returns a JSON list of all currently available models on PayPerQ, with prices and supported parameters. Model IDs change over time, so check this list if a model stops working.

## Verify Your Setup

Once OpenClaw is running with your PayPerQ configuration, you can verify requests are being processed by checking your usage history at [ppq.ai/account-activity](https://ppq.ai/account-activity).

## Try AutoClaw — Smart Model Routing

Don't want to pick a model yourself? [AutoClaw](/blog/using-autoclaw-with-payperq) is our intelligent router that automatically selects the best model for each prompt — saving you money on simple questions while using top-tier models when it matters.

## Problems?

Please contact us through the customer communication chatbot in the bottom right of [ppq.ai](https://ppq.ai), in our [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh) or on [Discord](https://discord.gg/BmMntEShYg)!
