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

OpenClaw needs Node 24.16+ or 26.1+. The official installer sets up a compatible Node.js for you if it is missing.

Run the official installer:

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

Other install methods are listed in the [official install docs](https://docs.openclaw.ai/install) and the [official GitHub repository](https://github.com/openclaw/openclaw).

When the installer finishes it starts OpenClaw's setup wizard. If `openclaw` is not found in the same terminal afterwards, open a new terminal (or run `source ~/.bashrc`). You can confirm the install with `openclaw --version`.

![OpenClaw installer output](/blog-images/using-openclaw-with-payperq/01-install-script.png)

### 2. Get Your PayPerQ API Key

Navigate to [ppq.ai/api-docs](https://ppq.ai/api-docs) and copy your API key from the "Your API Key" box. It starts with `sk-`. You can create separate keys for different applications on the [API keys page](https://ppq.ai/api-keys).

### 3. Connect OpenClaw to PayPerQ

You can do this in the setup wizard or by editing the config file. Pick one.

#### Option A: the setup wizard

1. Choose **Quick start**, then **One agent**.
2. At **Model/auth provider**, choose **More…**, type `custom` and pick **Custom Provider (Any OpenAI or Anthropic compatible endpoint)**.
3. Answer the prompts:
   - **API Base URL:** `https://api.ppq.ai`
   - **How do you want to provide this API key?** Paste API key now, then paste your PayPerQ key
   - **Endpoint compatibility:** OpenAI-compatible
   - **Model ID:** `claude-sonnet-5.5`
   - **Endpoint ID:** `ppq`
   - **Model alias:** leave blank

OpenClaw prepares the provider as `ppq/claude-sonnet-5.5` and tries the key against PayPerQ. If the key is rejected (HTTP 401) it says "Authentication failed" and leaves your default model unchanged.

![Custom Provider prompts in the wizard](/blog-images/using-openclaw-with-payperq/05-wizard-custom-provider-form.png)

If you re-run the wizard later, use `openclaw onboard`.

#### Option B: edit the config file

The wizard creates `~/.openclaw/openclaw.json`. Add the `env` and `models` attributes to it:

**Tip:** The `~/.openclaw/` folder is hidden by default. On macOS, press `Cmd + Shift + .` in Finder to show hidden files. The file is JSON5, so comments and trailing commas are allowed, but it must not be empty.

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
            "id": "claude-sonnet-5.5",
            "name": "Claude Sonnet 5.5"
          }
        ]
      }
    }
  }
}
```

**Important:** Replace `sk-YOUR_API_KEY_HERE` with your actual PayPerQ API key from [ppq.ai/api-docs](https://ppq.ai/api-docs). Your key goes under `env.vars`; a bare `env.PPQ_API_KEY` is rejected by current OpenClaw versions. If you already have an `openclaw.json` with other settings, merge these fields into your existing config rather than replacing it.

Check the file with:

```bash
openclaw config validate
```

If it reports an old layout, `openclaw doctor --fix` rewrites it (stop any running gateway first).

![Config validates](/blog-images/using-openclaw-with-payperq/10-config-fixed-valid.png)

### 4. Pick the Model and Restart the Gateway

If PayPerQ is the only model you have configured, OpenClaw already uses it. Otherwise choose it as the default:

```bash
openclaw models set ppq/claude-sonnet-5.5
openclaw models list
```

Then restart the gateway to apply your changes:

```bash
openclaw gateway restart
```

`openclaw gateway restart` works when OpenClaw runs as a background service. In a container, or anywhere systemd user services are unavailable, it reports "Gateway service disabled". Start the gateway in the foreground instead:

```bash
openclaw gateway run
```

### 5. Send a Test Message

In a second terminal:

```bash
openclaw tui
```

Type a message. The status line at the bottom shows the model in use (for example `claude-sonnet-5.5`).

![OpenClaw terminal UI](/blog-images/using-openclaw-with-payperq/15-tui-401.png)

**Troubleshooting:** `Authentication failed (provider returned HTTP 401)` means PayPerQ rejected the key ("API key not found or has been revoked"). Re-copy the key from [ppq.ai/api-docs](https://ppq.ai/api-docs), update `env.vars.PPQ_API_KEY`, and restart the gateway.

## Some Good Models to Try

We recommend using Anthropic Sonnet models for this tool (for example `claude-sonnet-5.5`), but these coding friendly models may work as well:

- **moonshotai/kimi-k2.6** - Moonshot AI's advanced multimodal coding model
- **mistralai/devstral-2512** - Mistral AI's development model
- **google/gemini-3-flash-preview** - Google's multimodal AI
- **z-ai/glm-4.7** - Z-AI's powerful model
- **minimax/minimax-m2.1** - MiniMax's advanced model
- **And many more premium models**

To use one, add it to the `models` array of the `ppq` provider (the `id` is exactly the model ID above), then run `openclaw models set ppq/<model-id>`.

## Get the Most Recent Models

Want to see all available models? You can fetch the most up-to-date list directly from PayPerQ's API:

```bash
curl https://api.ppq.ai/v1/models
```

This endpoint returns a JSON list of all currently available models on PayPerQ. Use models whose `supported_parameters` include `tools`; OpenClaw is an agent and needs tool calling.

## Verify Your Setup

Once OpenClaw is running with your PayPerQ configuration, you can verify requests are being processed by checking your usage history at [ppq.ai/account-activity](https://ppq.ai/account-activity).

## Try AutoClaw — Smart Model Routing

Don't want to pick a model yourself? [AutoClaw](/blog/using-autoclaw-with-payperq) is our intelligent router that automatically selects the best model for each prompt — saving you money on simple questions while using top-tier models when it matters.

## Problems?

Please contact us through the customer communication chatbot in the bottom right or in our [telegram channel](https://t.me/+ZjJDTazIrV0zNDFh)!
