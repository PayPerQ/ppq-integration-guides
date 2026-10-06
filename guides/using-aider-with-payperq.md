---
title: Using Aider AI pair programming CLI with PayPerQ
slug: using-aider-with-payperq
date: 2026-10-06
image: /blog-images/using-aider-with-payperq/aider_logo.jpg
ogImage: /blog-images/using-aider-with-payperq/aider_logo.jpg
intro:
author: Matt Ahlborg
tags:
  - Third Party Integrations
---

## What is Aider?

Aider is a command-line tool that enables you to pair program with AI models by editing your codebase in your local git repository using natural language.

## Step by Step Set Up

### 1. Install aider

Follow the [aider install page](https://aider.chat/docs/install.html). The one-liner installs aider together with Python 3.12 if you don't have it:

Mac & Linux:

```
curl -LsSf https://aider.chat/install.sh | sh
```

Windows (PowerShell):

```
powershell -ExecutionPolicy ByPass -c "irm https://aider.chat/install.ps1 | iex"
```

If the installer prints a warning that `~/.local/bin` is not on your PATH and `aider` is "command not found", run `source $HOME/.local/bin/env` or open a new terminal.

![Aider installer output](/blog-images/using-aider-with-payperq/01-install.png)

### 2. Get your PayPerQ API key

Open [ppq.ai/api-docs](https://ppq.ai/api-docs). Your key is in the "Your API Key" box (use the copy button), and the "Base URL" box shows `https://api.ppq.ai`. You can create separate keys for different applications on the [API keys page](https://ppq.ai/api-keys).

### 3. Set up an ["OpenAI compatible"](https://aider.chat/docs/llms/openai-compat.html) API in aider

PayPerQ's API is OpenAI compatible, so point aider at it with two environment variables.

Mac & Linux:

```
export OPENAI_API_BASE=https://api.ppq.ai
export OPENAI_API_KEY=<your PayPerQ key>
```

Windows (then restart your terminal):

```
setx OPENAI_API_BASE https://api.ppq.ai
setx OPENAI_API_KEY <your PayPerQ key>
```

### 4. Run aider with a model

Go to your project folder (aider works inside a git repository and offers to create one if there isn't one) and start aider. Prefix the model name with `openai/`. You can use any model, including non-OpenAI models, through our "OpenAI compatible" endpoint; the full list is at [api.ppq.ai/v1/models](https://api.ppq.ai/v1/models).

```
cd /path/to/your/project
aider --model openai/claude-sonnet-5.5
```

On the first run aider asks a few questions:

- "Add .aider* to .gitignore?" - the default (Yes) is fine.
- "Unknown context window size and costs, using sane defaults" with "Open documentation url for more info?" - this warning appears for every model used through an OpenAI-compatible endpoint because aider has no built-in data for it. It is harmless; answer `n`, or add `--no-show-model-warnings` to never see it.
- "Would you like to see what's new in this version?" - `n` is fine.

![Aider first run with PayPerQ](/blog-images/using-aider-with-payperq/03-env-and-first-run.png)

![Aider model warning](/blog-images/using-aider-with-payperq/04-model-warning.png)

When you see the `>` prompt with `Model: openai/claude-sonnet-5.5` in the banner, type a request and aider will edit your files. Check usage and costs on your [account activity](https://ppq.ai/account-activity) page.

![Aider ready](/blog-images/using-aider-with-payperq/06-ready.png)

To start without the extra prompts:

```
aider --model openai/claude-sonnet-5.5 --no-show-model-warnings --no-show-release-notes
```

## Problems?

If you see `401 ... API key not found or has been revoked`, re-copy your key from [ppq.ai/api-docs](https://ppq.ai/api-docs) and make sure `OPENAI_API_KEY` is set in the same terminal you launch aider from.

Please contact us through the customer communication chatbot in the bottom right of ppq.ai, in our [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh), or on [Discord](https://discord.gg/BmMntEShYg)!
