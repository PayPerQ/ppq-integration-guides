---
title: Using Aider AI pair programming CLI with PayPerQ
slug: using-aider-with-payperq
date: 2026-10-14
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

Follow the [official aider install page](https://aider.chat/docs/install.html). On Mac and Linux the quickest way is the one-liner:

```
curl -LsSf https://aider.chat/install.sh | sh
```

On Windows, follow the install commands on the official install page.

If you prefer pip, aider's docs use `python -m pip install aider-install` followed by `aider-install`. On recent Linux distributions (for example Ubuntu 24.04) the command is `python3`, and system-wide `pip install` is blocked ("externally-managed-environment"), so use the one-liner above, or a virtual environment or pipx as your distribution suggests.

When the installer finishes it may warn that `~/.local/bin` is not on your PATH. Open a new terminal, or run `source $HOME/.local/bin/env`, then check that it works:

```
aider --version
```

![Aider installed](/blog-images/using-aider-with-payperq/01-install-done.png)

### 2. Get your PayPerQ API key

Go to [ppq.ai/api-docs](https://ppq.ai/api-docs). The page shows **Your API Key** (hidden, with a copy button) and the **Base URL**, `https://api.ppq.ai`. You can create separate keys for different applications on the [API keys page](https://ppq.ai/api-keys), and see what you spent on the [account activity page](https://ppq.ai/account-activity).

### 3. Point aider at PayPerQ

PayPerQ is an ["OpenAI compatible"](https://aider.chat/docs/llms/openai-compat.html) API, so you use aider's OpenAI settings. Set these two environment variables (Mac/Linux):

```
export OPENAI_API_BASE=https://api.ppq.ai
export OPENAI_API_KEY=<your PayPerQ API key>
```

On Windows, use `setx OPENAI_API_BASE https://api.ppq.ai` and `setx OPENAI_API_KEY <your PayPerQ API key>`, then open a new terminal.

To keep the settings, add the two `export` lines to your shell profile, or put them in a `.env` file (aider reads `.env` from your home directory, the root of your git repo or the current directory; [docs](https://aider.chat/docs/config/dotenv.html)). Do not commit a file containing your key. As alternatives, aider also accepts `--set-env OPENAI_API_BASE=https://api.ppq.ai` and `--set-env OPENAI_API_KEY=<your PayPerQ API key>` on the command line.

### 4. Set the model and start aider

Change into your git repository and start aider with the model name prefixed by `openai/`. Use a model ID from the [PayPerQ model list](https://api.ppq.ai/v1/models); non-OpenAI models are served through our "OpenAI compatible" endpoint too. This guide uses `claude-sonnet-5.5`:

```
cd /path/to/your/project
aider --model openai/claude-sonnet-5.5
```

Use the model `id` exactly as listed in the catalog (older IDs such as `claude-3.7-sonnet` are no longer available).

On the first start aider asks a few questions:

- **Add .aider\* to .gitignore?** Yes is the recommended answer.
- If you are not inside a git repository it offers to create one.
- **Warning: Unknown context window size and costs, using sane defaults.** This is expected for models aider has no metadata for; you can ignore it, or hide it with `--no-show-model-warnings`. Aider may also add a "Did you mean one of these?" hint with a similar-looking model of another provider; ignore it.
- Right after installing, **Would you like to see what's new in this version?** Answer as you like.

You should then see the aider banner and a `>` prompt. Type a short test message, for example `Reply with the word OK`.

![Aider first start](/blog-images/using-aider-with-payperq/02-first-start.png)

If aider answers with `401 Invalid API key`, check that `OPENAI_API_KEY` holds your PayPerQ key. Also check the model ID against the catalog.

Tip: for unknown models aider uses its simplest `whole` edit format. You can try `--edit-format diff` for large files.

## Problems?

Please contact us through the customer communication chatbot in the bottom right of [ppq.ai](https://ppq.ai), in our [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh) or on [Discord](https://discord.gg/BmMntEShYg)!
