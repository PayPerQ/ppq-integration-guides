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

Follow the [official aider install page](https://aider.chat/docs/install.html). Aider documents this one-line installer for Mac and Linux (we tested it on Ubuntu 24.04):

```
curl -LsSf https://aider.chat/install.sh | sh
```

On Windows, run this in PowerShell:

```
powershell -ExecutionPolicy ByPass -c "irm https://aider.chat/install.ps1 | iex"
```

![Installing aider](/blog-images/using-aider-with-payperq/01-install.png)

The installer puts `aider` in `~/.local/bin`. If your shell says `aider: command not found`, open a new terminal or run `source $HOME/.local/bin/env`.

Note: the other method on aider's page, `python -m pip install aider-install`, fails on recent Linux distributions (for example Ubuntu 24.04) with an `externally-managed-environment` error. Use the one-line installer above, or one of the other methods on aider's install page.

### 2. Set up an ["openAI compatible"](https://aider.chat/docs/llms/openai-compat.html) API key in aider

Get your key at [ppq.ai/api-docs](https://ppq.ai/api-docs). The page shows your API key (masked, with a copy button) and the Base URL `https://api.ppq.ai`. You can create more keys for other apps at [ppq.ai/api-keys](https://ppq.ai/api-keys).

Set these two environment variables (Mac/Linux):

```
export OPENAI_API_BASE=https://api.ppq.ai
export OPENAI_API_KEY=<your PayPerQ API key>
```

On Windows (PowerShell/cmd), use `setx OPENAI_API_BASE https://api.ppq.ai` and `setx OPENAI_API_KEY <your PayPerQ API key>`, then restart your terminal.

`export` only lasts for the current terminal. To keep the settings, put them in a file named `.env` in your home directory (aider loads `.env` from your home directory, your git repo root and the current directory):

```
OPENAI_API_BASE=https://api.ppq.ai
OPENAI_API_KEY=<your PayPerQ API key>
```

Keep that file private and do not commit it to git.

### 3. Start aider with a PayPerQ model

Go to your project's git repository and start aider with the model name prefixed by `openai/`. You can use any model from our "openAI compatible" endpoint, including non-openAI models:

```
cd /path/to/your/project
aider --model openai/claude-sonnet-5.5
```

The first time you run it, aider asks a few questions: whether to add `.aider*` to your `.gitignore` (recommended: yes), and whether to open a documentation page about the model warning. Answer `n` to the latter (and `n` to "see what's new").

![Aider first run](/blog-images/using-aider-with-payperq/02-first-run.png)

You will see "Unknown context window size and costs, using sane defaults". That is normal for models aider does not know by name; the model still works. To hide the warning, add `--no-show-model-warnings`.

Type a message at the `>` prompt. A reply from the model means you are connected (this screenshot used the cheaper `openai/gpt-5.4-nano`):

![Aider answering through PayPerQ](/blog-images/using-aider-with-payperq/03-first-answer.png)

Model IDs must exactly match our catalog. See the full list at [api.ppq.ai/v1/models](https://api.ppq.ai/v1/models). If you use an ID that does not exist (for example the retired `claude-3.7-sonnet`), aider shows `No endpoints found for ...`. For a cheaper model, try `aider --model openai/gpt-5.4-nano`. Check your spending on the [account activity page](https://ppq.ai/account-activity).

## Problems?

Please contact us through the customer communication chatbot in the bottom right of ppq.ai, in our [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh) or on [Discord](https://discord.gg/BmMntEShYg)!
