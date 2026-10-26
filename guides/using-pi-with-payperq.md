---
title: Using Pi with PayPerQ
slug: using-pi-with-payperq
date: 2026-10-26
image: /blog-images/using-pi-with-payperq/cover.jpg
ogImage: /blog-images/using-pi-with-payperq/cover.jpg
intro: Run the Pi terminal coding agent on PayPerQ models by adding PayPerQ as a custom provider in Pi's models.json.
author: PayPerQ
tags:
  - Third Party Integrations
---

## What is Pi?

[Pi](https://pi.dev) is a terminal-based coding agent from Earendil Inc. and contributors, released under the MIT license. You start it in a project folder, give it a task, and it reads files, runs commands and edits content, showing each step in the terminal.

Pi is deliberately minimal and configurable: it supports skills, `AGENTS.md` files, extensions, prompt templates and themes, and it can talk to any model service that offers an OpenAI-, Anthropic- or Google-compatible API. PayPerQ exposes an OpenAI-compatible API, so you can use it as Pi's model provider.

## Step by Step Set Up

### 1. Prerequisites

- A PayPerQ account and API key. Copy your key from [ppq.ai/api-docs](https://ppq.ai/api-docs); you can create extra keys at [ppq.ai/api-keys](https://ppq.ai/api-keys).
- macOS or Linux for the installer used below.

> **Note:** Pi needs Node.js 22.19.0 or newer. The installer offers to install a standalone Node.js for you, so you only need your own Node.js if you install Pi from npm instead.

> **Windows:** Pi runs natively on Windows or inside WSL; follow the [Windows setup page](https://pi.dev/docs/latest/windows). Not executed for this guide.

### 2. Install Pi

Run the official installer:

```bash
curl -fsSL https://pi.dev/install.sh | sh
```

The installer asks four questions. Answer them one at a time.

**Install Node.js.** The installer checks for Node.js 22.19.0 or newer. If it is missing, it asks whether to install a standalone copy. Press Enter to accept (`Y`).

![Installer asking to install Node.js](/blog-images/using-pi-with-payperq/01-installer-nodejs-prompt.png)

**Confirm the install.** The installer shows that Pi will go to `~/.pi/agent/bin/pi` and offers `y` (Install Pi, default) or `n`. Press Enter.

![Installer asking to choose an action](/blog-images/using-pi-with-payperq/02-installer-action-prompt.png)

**Add Pi to your PATH.** The installer asks whether to add `~/.pi/agent/bin` to your PATH in your shell profile. Press Enter to accept.

![Installer asking to add Pi to PATH](/blog-images/using-pi-with-payperq/03-installer-path-prompt.png)

> **macOS:** the installer edits the profile of your shell; on macOS that is zsh, so expect `~/.zshrc` rather than `~/.bashrc`. Not executed for this guide, which ran on Linux with bash.

**Start now?** The installer asks `Start pi now? [Y/n]`. Answer `n`; you will start Pi in step 3.

![Installer asking whether to start Pi now](/blog-images/using-pi-with-payperq/04-installer-start-prompt.png)

Open a new terminal window so the PATH change applies, then check the install:

```bash
pi --version
```

![pi --version printing 1.4.0](/blog-images/using-pi-with-payperq/05-pi-version.png)

> **Alternative:** install from npm with `npm install -g --ignore-scripts @earendil-works/pi-coding-agent` (needs Node.js 22.19 or newer). Not executed for this guide.

### 3. Start Pi

Change to the folder you want Pi to work in and start it:

```bash
cd /path/to/your/project
pi
```

Pi opens without asking any setup questions. It warns that no models are available, because it does not know any provider yet. Leave Pi open and continue with step 4.

![Pi first start with the no models available warning](/blog-images/using-pi-with-payperq/06-pi-first-start.png)

> **Note:** PayPerQ is not one of Pi's built-in providers, so it does not appear in `/login` yet. You first describe it in a config file (step 4); after that, `/login` lists it and stores your key (step 5).

### 4. Add PayPerQ as a provider

Open a second terminal. Create the file `~/.pi/agent/models.json` in your editor (this is Pi's agent directory; the folder already exists after the install) and paste this:

```json
{
  "providers": {
    "payperq": {
      "name": "PayPerQ",
      "baseUrl": "https://api.ppq.ai/v1",
      "api": "openai-completions",
      "models": [
        {
          "id": "gpt-5.4-nano",
          "name": "GPT-5.4 Nano",
          "input": ["text", "image"],
          "contextWindow": 400000,
          "cost": { "input": 0.211, "output": 1.31875, "cacheRead": 0.0211, "cacheWrite": 0.211 }
        },
        {
          "id": "claude-haiku-4.5",
          "name": "Claude Haiku 4.5",
          "input": ["text", "image"],
          "contextWindow": 200000,
          "cost": { "input": 1.055, "output": 5.275, "cacheRead": 0.1055, "cacheWrite": 1.31875 }
        }
      ]
    }
  }
}
```

The file holds no key: you store that with `/login` in the next step.

> **Note:** These two models are examples. The full list is at [api.ppq.ai/v1/models](https://api.ppq.ai/v1/models); coding agents need a model whose `supported_parameters` include `tools`. The catalog's format is different from Pi's, so map the fields by hand: `id` is Pi's `id`, `name` is `name`, `context_length` is `contextWindow`, `architecture.input_modalities` is `input` (Pi accepts only `text` and `image`), and `pricing.input_per_1M_tokens`, `output_per_1M_tokens`, `cache_read_per_1M_tokens` and `cache_write_per_1M_tokens` are `cost.input`, `cost.output`, `cost.cacheRead` and `cost.cacheWrite`.

### 5. Store your API key with /login

Go back to the terminal where Pi is running. Type `/login`, choose **Sign in with an API key**, and type `payperq` to filter the provider list. PayPerQ appears as "not configured":

![Selecting PayPerQ in /login](/blog-images/using-pi-with-payperq/10-login-select-payperq.png)

Press Enter. Pi asks for the key:

![Enter API key prompt](/blog-images/using-pi-with-payperq/11-login-enter-key.png)

Paste your PayPerQ API key and press Enter. Pi saves it to `~/.pi/agent/auth.json`:

![Key saved](/blog-images/using-pi-with-payperq/12-login-saved.png)

> **Note:** the line starting with "Error:" only says that no default model is set yet; the key is saved. Step 6 fixes it.

> **Note:** the field shows the key in clear text while you paste it, so do not do this while sharing your screen.

> **Alternative:** you can put `"apiKey": "<your PayPerQ API key>"` into the `payperq` provider in `models.json` instead. Pi's docs say the value can also be `"$NAME"` (an environment variable) or `"!command"` (the output of a command). Pi prefers a key stored in `auth.json` over one in `models.json`. If you use an environment variable, it must be set in the shell that starts Pi (macOS uses zsh, so `~/.zshrc`, not `~/.bashrc`). Only the `/login` and literal-key routes were run for this guide.

### 6. Pick a model

Type `/model`. Pi reloads `models.json` when you open this picker, and lists the PayPerQ models next to their provider id `[payperq]`. Select one with the arrow keys and Enter.

![Pi model picker listing the PayPerQ models](/blog-images/using-pi-with-payperq/13-model-picker-after-login.png)

> **Tip:** press Ctrl+S on a model in the picker to save it as the default for new sessions. Pi stores it in `~/.pi/agent/settings.json` as `defaultProvider` and `defaultModel`.

### 7. Send a test prompt

Type a short prompt and press Enter. For a first check, use a small request, for example:

```
Reply with the word OK
```

Pi sends it to PayPerQ and prints the model's answer. The footer shows the current model and context size.

![Test prompt answered by gpt-5.4-nano](/blog-images/using-pi-with-payperq/09-test-prompt-answer.png)

To see what you spent, open [ppq.ai/account-activity](https://ppq.ai/account-activity).

> **Note:** Pi's footer and `/session` token counts depend on the provider reporting usage. In our runs some answers showed no token counts in the footer, so rely on the PayPerQ activity page for real costs.

### Troubleshooting

**`Error: 401 "Invalid API key"` after sending a prompt.** The key Pi stored is wrong or was altered when you pasted it. Run `/login` again and paste the key from [ppq.ai/api-docs](https://ppq.ai/api-docs); no restart is needed.

**PayPerQ does not appear in `/login`.** Pi only lists providers it knows about. Create `~/.pi/agent/models.json` as in step 4 first, then run `/login` again.

**A PayPerQ model does not appear in `/model`.** Pi's docs say a custom model stays unavailable until Pi can resolve credentials for its provider. Do step 5, and check that `models.json` is valid JSON.

**"No default model is configured for provider payperq" right after `/login`.** The key was saved. Pick a model with `/model`.

**Pi says "No models available" at startup.** Expected until `models.json` exists and a key is stored. Do steps 4 and 5, then open `/model`.

## Problems?

Please contact us through the customer communication chatbot in the bottom right of ppq.ai, in our [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh), or on [Discord](https://discord.gg/BmMntEShYg).
