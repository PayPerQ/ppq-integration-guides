---
title: Using the pi coding agent with PayPerQ
slug: using-pi-with-payperq
date: 2026-10-15
image: /ppqai-opengraph-banner.png
ogImage: /ppqai-opengraph-banner.png
author: PayPerQ
tags:
  - Third Party Integrations
---

## What is pi?

[pi](https://pi.dev) is a minimal, extensible coding agent that runs in your terminal and works with the files in your current folder. It supports many providers and models, and it can talk to any OpenAI-compatible endpoint, which is how it connects to PayPerQ.

## Prerequisites

- A PayPerQ account with some balance.
- Your PayPerQ API key. Open [ppq.ai/api-docs](https://ppq.ai/api-docs) and copy the key from the "Your API Key" box (the same page shows the Base URL `https://api.ppq.ai`). You can create separate keys per application at [ppq.ai/api-keys](https://ppq.ai/api-keys).
- macOS or Linux for the steps below (Windows setup is covered in [pi's Windows docs](https://pi.dev/docs/latest/windows.md)).

## Step by Step Set Up

### 1. Install pi

The official installer works on macOS and Linux:

```bash
curl -fsSL https://pi.dev/install.sh | sh
```

If Node.js 22.19 or newer is missing, the installer asks whether to install a standalone copy; answer `Y`. It then asks whether to install pi (`y`), whether to add `~/.pi/agent/bin` to your `PATH` in `~/.bashrc` (`Y`), and whether to start pi now. You can answer either way: pi needs a provider before it is useful, so the next step is to configure PayPerQ as described below.

Alternatively, install from npm (requires Node.js 22.19 or newer):

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
```

Check the installation (open a new shell, or run `export PATH="$HOME/.pi/agent/bin:$PATH"` first if the command is not found):

```bash
pi --version
```

### 2. Add PayPerQ as a provider

pi's `/login` list contains many built-in providers but no PayPerQ entry and no "custom endpoint" entry, so PayPerQ is added through pi's `models.json` file, which pi documents for "an OpenAI-compatible endpoint". It lives in pi's agent directory, `~/.pi/agent/models.json`. Create it with this content:

```json
{
  "$schema": "https://pi.dev/schemas/models.schema.json",
  "providers": {
    "payperq": {
      "baseUrl": "https://api.ppq.ai/v1",
      "api": "openai-completions",
      "apiKey": "$PPQ_API_KEY",
      "models": [
        {
          "id": "gpt-5.4-nano",
          "name": "GPT-5.4 Nano",
          "input": ["text", "image"],
          "contextWindow": 400000,
          "cost": { "input": 0.211, "output": 1.31875, "cacheRead": 0.0211, "cacheWrite": 0.211 }
        },
        {
          "id": "claude-sonnet-5.5",
          "name": "Claude Sonnet 5.5",
          "input": ["text", "image"],
          "contextWindow": 1000000,
          "cost": { "input": 2.11, "output": 10.55, "cacheRead": 0.1055, "cacheWrite": 2.6375 }
        },
        {
          "id": "gemini-3.7-flash",
          "name": "Gemini 3.7 Flash",
          "input": ["text", "image"],
          "contextWindow": 1048576,
          "cost": { "input": 0.375, "output": 1.875, "cacheRead": 0.0375, "cacheWrite": 0.0208 }
        }
      ]
    }
  }
}
```

- `baseUrl` is PayPerQ's OpenAI-compatible endpoint and `api` tells pi to use the OpenAI chat completions protocol.
- `apiKey` of `$PPQ_API_KEY` makes pi read your key from an environment variable, so the key is never written into the file.
- `contextWindow` and `cost` (USD per million tokens) are optional. Without them pi assumes a 128k context window and cannot show a cost. The values above are copied from the [PayPerQ model list](https://api.ppq.ai/v1/models); prices can change, so check the list if cost figures matter to you.

Now put your key in the environment and start pi in the folder you want to work in:

```bash
export PPQ_API_KEY="<your PayPerQ API key>"
cd <your-project-dir>
pi
```

Replace `<your-project-dir>` with the folder you want pi to work in.

The environment variable must be set in the same shell that starts pi, otherwise the models will not show up.

### 3. Pick a model

Any model from the [PayPerQ model list](https://api.ppq.ai/v1/models) can be added to the `models` array in the same way, using its exact `id`. For a coding agent, choose a model whose `supported_parameters` include `tools`; the three above do.

In pi, type `/model` and press Enter. The picker lists the models tagged `[payperq]`. Select one with Enter, or press `Ctrl+S` to make it the default for new sessions. pi reloads `models.json` whenever the picker opens, so you can add models without restarting.

### 4. Test it

Type a short prompt in the editor and press Enter:

```text
Reply with the word OK
```

You should see the answer from your chosen PayPerQ model, and the footer shows the token counts (and cost, when `cost` is configured). Type `/session` to see tokens and cost per model for the current session. pi can also use its file tools through PayPerQ, for example reading a file you mention in a prompt.

### 5. Check usage

- In pi: the footer and `/session`. These are computed by pi from the prices in your `models.json`, and they can read zero for some models (see Troubleshooting).
- On PayPerQ: your real usage and costs are at [ppq.ai/account-activity](https://ppq.ai/account-activity).

## Troubleshooting

- **`pi: command not found` after installing.** Open a new shell, or run `export PATH="$HOME/.pi/agent/bin:$PATH"`.
- **No models available / the PayPerQ models are missing from `/model`.** pi only lists models whose provider has usable credentials. Make sure `PPQ_API_KEY` is exported in the shell that runs `pi`, and that `~/.pi/agent/models.json` is valid JSON.
- **Token and cost show 0 for Claude Sonnet 5.5.** In our test, replies from `claude-sonnet-5.5` were correct but pi recorded 0 tokens for them, while `gpt-5.4-nano` and `gemini-3.7-flash` reported usage normally. Use [ppq.ai/account-activity](https://ppq.ai/account-activity) for the real numbers.
- **Footer shows a 128k context window.** Add `contextWindow` to the model entry in `models.json`.

## Problems?

Please contact us through the customer communication chatbot in the bottom right of ppq.ai, in our [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh), or on [Discord](https://discord.gg/BmMntEShYg).
