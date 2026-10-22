---
title: Using Pi with PayPerQ
slug: using-pi-with-payperq
date: 2026-10-22
image: /blog-images/using-pi-with-payperq/cover.jpg
ogImage: /blog-images/using-pi-with-payperq/cover.jpg
intro: Run the Pi terminal coding agent on pay-per-use PayPerQ models instead of a subscription, with the key stored in Pi's own credential file.
author: PayPerQ
tags:
  - Third Party Integrations
---

## What is Pi?

Pi is an AI agent that works from your terminal. You give it a goal and a working folder, and it can inspect files, run commands, edit content and work through multi-step tasks. Pi is made by Earendil Inc. and contributors and is released under the MIT License ([pi.dev](https://pi.dev)).

Pi is built to be adapted to your workflow through extensions, skills, prompt templates and themes, and it supports many model providers. PayPerQ is not one of its built-in providers, but Pi accepts any OpenAI-compatible endpoint through a `models.json` file, which is what this guide uses.

## Step by Step Set Up

### 1. Prerequisites

- A PayPerQ account and API key. Open [ppq.ai/api-docs](https://ppq.ai/api-docs) to see your key and the base URL (`https://api.ppq.ai`). You can create more keys at [ppq.ai/api-keys](https://ppq.ai/api-keys).
- macOS or Linux for the installer used below.
- Node.js 22.19 or newer only if you install Pi from npm. The installer in step 2 downloads its own Node.js if you do not have one.

### 2. Install Pi

Run the official installer:

```
curl -fsSL https://pi.dev/install.sh | sh
```

If Node.js is missing, the installer asks whether to install a standalone Node.js. Answer `Y`:

![Pi installer asking to install Node.js](/blog-images/using-pi-with-payperq/01-install-prompt.png)

It then asks where to install Pi (`/home/<you>/.pi/agent/bin/pi`) and offers to add that folder to your `PATH` in `~/.bashrc`. When it finishes it asks "Start pi now?":

![Pi installer finished](/blog-images/using-pi-with-payperq/04-install-done.png)

Open a new shell, or run the `export PATH=...` line the installer prints, and check the install:

```
pi --version
```

![pi --version](/blog-images/using-pi-with-payperq/05-version.png)

The installer edited `~/.bashrc` in this run. This guide did not run the installer on macOS, so if you use zsh and `pi` is not found, add `export PATH="$HOME/.pi/agent/bin:$PATH"` to `~/.zshrc` yourself.

If you prefer npm: `npm install -g --ignore-scripts @earendil-works/pi-coding-agent` (from the Pi docs, not run for this guide).

Pi's docs have separate pages for [Windows](https://pi.dev/docs/latest/windows) and [Android](https://pi.dev/docs/latest/termux); this guide did not run those.

### 3. Add PayPerQ as a provider

Pi reads custom providers from `~/.pi/agent/models.json` (the agent directory defaults to `~/.pi/agent`). Create the file in any text editor (for example `mkdir -p ~/.pi/agent && nano ~/.pi/agent/models.json`) with this content:

```json
{
  "$schema": "https://pi.dev/schemas/models.schema.json",
  "providers": {
    "payperq": {
      "name": "PayPerQ",
      "baseUrl": "https://api.ppq.ai",
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
          "id": "gemini-3.7-flash",
          "name": "Gemini 3.7 Flash",
          "input": ["text", "image"],
          "contextWindow": 1048576,
          "cost": { "input": 0.375, "output": 1.875, "cacheRead": 0.0375, "cacheWrite": 0.02083333333333335 }
        },
        {
          "id": "claude-sonnet-5.5",
          "name": "Claude Sonnet 5.5",
          "input": ["text", "image"],
          "contextWindow": 1000000,
          "cost": { "input": 2.11, "output": 10.55, "cacheRead": 0.1055, "cacheWrite": 2.6375 }
        }
      ]
    }
  }
}
```

![models.json](/blog-images/using-pi-with-payperq/07-models-json.png)

The three models are an example. The full list is the [PayPerQ catalog](https://api.ppq.ai/v1/models), which uses a different format than Pi's `models.json`. To add a model, copy these fields from its catalog entry:

| `models.json` field | Catalog field |
| --- | --- |
| `id` | `id` |
| `name` | `name` |
| `contextWindow` | `context_length` |
| `cost.input` / `cost.output` | `pricing.input_per_1M_tokens` / `pricing.output_per_1M_tokens` |
| `cost.cacheRead` / `cost.cacheWrite` | `pricing.cache_read_per_1M_tokens` / `pricing.cache_write_per_1M_tokens` |
| `input` | `architecture.input_modalities` (use `"text"` and `"image"`) |

Pi works by calling tools (reading files, running commands), so choose models whose catalog entry lists `tools` in `supported_parameters`.

### 4. Store your API key with /login

Start Pi in any folder:

```
pi
```

Type `/login`, choose **Sign in with an API key**, and type `payperq` to filter the provider list. PayPerQ appears as "not configured":

![Selecting PayPerQ in /login](/blog-images/using-pi-with-payperq/10-login-select-payperq.png)

Press Enter. Pi asks for the key:

![Enter API key prompt](/blog-images/using-pi-with-payperq/11-login-enter-key.png)

Paste `<your PayPerQ API key>` and press Enter. The field shows the key in clear text while you paste it, so do not do this while sharing your screen. Pi saves the key to `~/.pi/agent/auth.json` (file mode 600):

![Key saved](/blog-images/using-pi-with-payperq/12-login-saved.png)

The line starting with "Error:" only says that no default model is set yet; the key is saved. Step 5 fixes it.

You can instead put `"apiKey": "<your PayPerQ API key>"` into the `payperq` provider in `models.json`. The Pi docs say the value can also be `"$NAME"` (an environment variable) or `"!command"` (the output of a command). Pi prefers a key stored in `auth.json` over one in `models.json`. If you use an environment variable, it must be set in the shell that starts Pi (macOS uses zsh, so `~/.zshrc`, not `~/.bashrc`). Only the `/login` and literal-key routes were run for this guide.

### 5. Pick a model

Type `/model`. Pi lists the models from `models.json` whose provider has a key:

![Model picker](/blog-images/using-pi-with-payperq/13-model-picker-after-login.png)

Move to a model and press Enter to use it for this session. Press Ctrl+S instead to save it as the default for new sessions (Pi writes `defaultProvider` and `defaultModel` to `~/.pi/agent/settings.json`). After a restart the footer shows the saved model:

![Default model after restart](/blog-images/using-pi-with-payperq/19-restart-default-model.png)

`gpt-5.4-nano` is the cheapest of the three examples; `claude-sonnet-5.5` is a stronger choice for real coding work.

### 6. Send a test prompt

Type a short prompt:

```
Reply with the word OK
```

![Test prompt answered by gpt-5.4-nano](/blog-images/using-pi-with-payperq/09-test-prompt-answer.png)

The answer comes back from the PayPerQ model, and the footer shows the token counts, the session cost and the current model. `/session` shows the totals per model. For your account-wide usage and costs, open [ppq.ai/account-activity](https://ppq.ai/account-activity).

To confirm tool calling works, ask for something Pi must run a command for:

```
Use the ls command and reply with only the names of the files in this folder
```

![Pi running ls through a PayPerQ model](/blog-images/using-pi-with-payperq/18-tool-call-nano.png)

Pi shows each command it runs and does not ask before every tool call, so start in a folder you are happy for it to work in.

### 7. Troubleshooting

- **The installer prints `sudo: not found` and fails** while installing Node.js. On a minimal Linux image without Node.js, the installer tries to install `xz-utils` with `sudo`. Install `xz-utils` yourself (for example `apt-get install xz-utils` as root) and run the installer again.

  ![Installer failing on a missing sudo](/blog-images/using-pi-with-payperq/02-install-xz-error.png)

- **`pi: command not found` after installing.** The installer adds `~/.pi/agent/bin` to `~/.bashrc` only. Open a new shell, run the `export PATH=...` line it printed, or add the line to your own shell profile.
- **`/model` shows "No matching models".** The provider has no key yet. Pi only lists models whose provider has usable authentication; do step 4.
- **"No default model is configured for provider payperq"** right after `/login`. The key was saved. Pick a model with `/model`.
- **Pi stays on "Working" and never answers.** This happened once with `gemini-3.7-flash` on a prompt that made Pi run a command (no answer after 85 seconds; Escape aborted it). A plain prompt on the same model, and the same command prompt on `gpt-5.4-nano` and `claude-sonnet-5.5`, worked. If a model hangs on tool use, switch with `/model`.
- **A yellow tmux warning about `extended-keys`** appears only when you run Pi inside tmux. Pi suggests adding `set -g extended-keys on` to `~/.tmux.conf`.
- **Requests are rejected.** Pi's docs say to check the `api` type and `compat` settings in `models.json`. A rejected key shows up as HTTP 401 from PayPerQ; check that you pasted the key from [ppq.ai/api-docs](https://ppq.ai/api-docs).

## Problems?

Ask the chatbot at the bottom right of [ppq.ai](https://ppq.ai), join the [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh) or the [Discord](https://discord.gg/BmMntEShYg).
