---
title: Using the pi coding agent with PayPerQ
slug: using-pi-with-payperq
date: 2026-10-15
image: /blog-images/using-pi-with-payperq/06-test-prompt-answer.png
ogImage: /blog-images/using-pi-with-payperq/06-test-prompt-answer.png
author: PayPerQ
tags:
  - Third Party Integrations
---

## What is pi?

[pi](https://pi.dev) is a minimal, customizable AI coding agent that runs in your terminal and works with the files on your machine. It shows every file read, search, command and edit it performs. pi does not ship with PayPerQ as a built-in provider, but it can talk to any OpenAI-compatible endpoint, which is how we connect it to PayPerQ below.

## Prerequisites

1. A PayPerQ account with some balance.
2. Your PayPerQ API key. Open [ppq.ai/api-docs](https://ppq.ai/api-docs): the "Your API Key" box shows the key (masked, with a copy button) and the "Base URL" box shows `https://api.ppq.ai`. If you want a separate key just for pi, create one at [ppq.ai/api-keys](https://ppq.ai/api-keys).
3. Linux or macOS with a terminal and internet access. The installer below sets up Node.js for you if it is missing (pi needs Node.js 22.19 or newer).

In the commands below, `<your PayPerQ API key>` stands for your real key. Never paste your key into a screenshot or share it.

## Step by Step Set Up

### 1. Install pi

On macOS or Linux, run the official installer:

```bash
curl -fsSL https://pi.dev/install.sh | sh
```

The installer asks a few questions. On a fresh Linux machine without Node.js we saw these, in this order:

1. "Install them now with standalone Node.js? [Y/n]": answer `Y`.
2. "Choose an action: y Install Pi (default)": answer `y`.
3. "Add /home/user/.pi/agent/bin to your PATH in ~/.bashrc now? [Y/n]": accept the default.
4. "Start pi now? [Y/n]": you can answer `n` and finish the setup first.

![pi installer asking to install Node.js](/blog-images/using-pi-with-payperq/01-installer-node-prompt.png)

![pi installer finished](/blog-images/using-pi-with-payperq/03-installer-done.png)

pi installs to `~/.pi/agent/bin/pi`. Open a new shell (or run `export PATH="$HOME/.pi/agent/bin:$PATH"`) and check it works:

```bash
pi --version
```

If you prefer npm and already have Node.js 22.19 or newer, the official alternative is `npm install -g --ignore-scripts @earendil-works/pi-coding-agent`. For native Windows, follow pi's own [Windows setup guide](https://pi.dev/docs/latest/windows).

### 2. Start pi once

Change to a folder you want pi to work in and start it:

```bash
cd ~/my-project
pi
```

On the first start pi downloads two helper tools (`fd` and `ripgrep`) into `~/.pi/agent/bin`, then warns that no models are available. That is expected, we add PayPerQ next. You can ignore the "Update Available" banner for now (see Troubleshooting).

![pi first start with no models available](/blog-images/using-pi-with-payperq/04-first-run-no-models.png)

To quit pi, use the keys shown in its hint line at the top, "ctrl+c/ctrl+d clear/exit" (we exited with `Ctrl+C`).

### 3. Add PayPerQ as a provider

pi's `/login` command only lists built-in providers (PayPerQ is not one of them, and there is no "custom endpoint" entry there). For an OpenAI-compatible endpoint, pi reads a file called `models.json` in its agent directory, `~/.pi/agent/models.json`.

First make your key available to pi as an environment variable. Add this line to your shell profile (for example `~/.bashrc`) and open a new shell:

```bash
export PPQ_API_KEY="<your PayPerQ API key>"
```

Then create `~/.pi/agent/models.json`:

```json
{
  "$schema": "https://pi.dev/schemas/models.schema.json",
  "providers": {
    "payperq": {
      "baseUrl": "https://api.ppq.ai",
      "api": "openai-completions",
      "apiKey": "$PPQ_API_KEY",
      "models": [
        {
          "id": "claude-sonnet-5.5",
          "name": "Claude Sonnet 5.5 (PayPerQ)",
          "input": ["text", "image"],
          "contextWindow": 1000000,
          "cost": { "input": 2.11, "output": 10.55, "cacheRead": 0.1055, "cacheWrite": 2.6375 }
        },
        {
          "id": "deepseek/deepseek-v4-flash",
          "name": "DeepSeek V4 Flash (PayPerQ)",
          "contextWindow": 1048576,
          "cost": { "input": 0.096005, "output": 0.19201, "cacheRead": 0, "cacheWrite": 0 }
        },
        {
          "id": "qwen/qwen3.7-flash",
          "name": "Qwen 3.7 Flash (PayPerQ)",
          "input": ["text", "image"],
          "contextWindow": 1000000,
          "cost": { "input": 0.03165, "output": 0.13715, "cacheRead": 0, "cacheWrite": 0 }
        }
      ]
    }
  }
}
```

What the fields mean:

- `baseUrl` is the PayPerQ base URL, `https://api.ppq.ai`.
- `api` is `openai-completions`, pi's name for the OpenAI-compatible chat completions protocol.
- `apiKey` is `"$PPQ_API_KEY"`: pi reads the key from that environment variable, so the key never sits in the file. (pi also accepts a literal key or a `!command` here, see pi's [models documentation](https://pi.dev/docs/latest/models).)
- `contextWindow` and `cost` are optional. Without `contextWindow` pi assumes 128k tokens; with `cost` pi can show the spend in its footer. The numbers above are the context length and the price per 1M tokens from the [PayPerQ model list](https://api.ppq.ai/v1/models).

### 4. Pick a model

Start pi from the shell where `PPQ_API_KEY` is set and run:

```text
/model
```

pi reloads `models.json` when you open the picker and lists the models of every provider it has a key for:

![pi model picker listing the three PayPerQ models](/blog-images/using-pi-with-payperq/05-model-picker.png)

Choose a model with the arrow keys and `Enter`. Press `Ctrl+S` on a model to make it the default for new sessions.

The three models above exist in the PayPerQ catalog and all list `tools` in `supported_parameters`, which pi needs for its file and command tools. To add another model, copy its exact `id` from [api.ppq.ai/v1/models](https://api.ppq.ai/v1/models), make sure `tools` is in its `supported_parameters`, and add it to the `models` array.

- `qwen/qwen3.7-flash` is the cheapest of the three, good for trying things out.
- `claude-sonnet-5.5` is the strongest of the three, but see the usage note below.

### 5. Send a test prompt

Type a short prompt:

```text
Reply with the word OK
```

![pi answering through PayPerQ](/blog-images/using-pi-with-payperq/06-test-prompt-answer.png)

pi can also run commands for you. We asked it `Run the bash command: echo hello-from-pi and then reply with only its output.`; it ran the command and answered with its output, which confirms tool calling works through PayPerQ. Note that pi does not ask for confirmation before each tool call, so use it in a project folder you can restore (see pi's [security notes](https://pi.dev/docs/latest/security)).

![pi running a command through PayPerQ](/blog-images/using-pi-with-payperq/09-tool-call-answer.png)

### 6. Check your usage

- In pi, the footer shows token counts and the running cost, and `/session` shows the session file, message count and token usage.
- On PayPerQ, your real usage and costs are on [ppq.ai/account-activity](https://ppq.ai/account-activity).

**Note for Claude models:** when we ran `claude-sonnet-5.5` the answer worked, but pi's footer and `/session` stayed at 0 tokens and $0 for those messages, most likely because PayPerQ's streamed usage for Claude models uses different field names (`input_tokens` and `output_tokens`, as we saw in a raw API response) than the ones pi appears to count. Models such as `qwen/qwen3.7-flash` are counted correctly. Always treat [ppq.ai/account-activity](https://ppq.ai/account-activity) as the source of truth for spending.

![pi session info](/blog-images/using-pi-with-payperq/07-session-info.png)

## Troubleshooting

**`/model` says "No matching models".** pi only lists models whose provider has a usable key, and `$PPQ_API_KEY` must be set in the shell that starts pi. Export it (or add it to your shell profile and open a new shell), then start pi again. pi's docs say the same: "Environment variables must be present in the process that starts Pi."

![No matching models when PPQ_API_KEY is not set](/blog-images/using-pi-with-payperq/10-no-models-without-env-var.png)

**The footer shows 0 tokens or $0.000 for Claude models.** See the note in step 6. Check [ppq.ai/account-activity](https://ppq.ai/account-activity) instead.

**"Update Available" banner.** The installer installed version 1.2.0 while 1.3.0 was already out. Run `pi update` to upgrade; after updating to 1.3.0 our PayPerQ models still showed up in `/model`.

**Warning "tmux extended-keys is off".** Only shown inside tmux; it did not stop us from using pi. To silence it, follow the hint on screen and add `set -g extended-keys on` to `~/.tmux.conf`.

**Still stuck?** Please contact us through the customer communication chatbot in the bottom right of [ppq.ai](https://ppq.ai), in our [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh), or on [Discord](https://discord.gg/BmMntEShYg).
