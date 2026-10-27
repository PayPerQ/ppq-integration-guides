---
title: Using Pi with PayPerQ
slug: using-pi-with-payperq
date: 2026-10-27
image: /blog-images/using-pi-with-payperq/cover.jpg
ogImage: /blog-images/using-pi-with-payperq/cover.jpg
intro: Run the Pi coding agent on pay-per-use PayPerQ models instead of a subscription, by adding PayPerQ as a custom provider in Pi's models.json.
author: PayPerQ
tags:
  - Third Party Integrations
---

## What is Pi?

Pi is a minimal, extensible agent harness that runs in your terminal and works with the files in your project. It is made by Earendil and published at [pi.dev](https://pi.dev). Pi ships with powerful defaults but skips features like sub-agents and plan mode; you adapt it with extensions, skills, prompt templates and themes.

Pi has built-in support for many model providers and also lets you add any OpenAI-compatible endpoint through a `models.json` file. That is how you connect it to PayPerQ.

## Step by Step Set Up

### 1. Prerequisites

- A PayPerQ account and API key. Open [ppq.ai/api-docs](https://ppq.ai/api-docs) and copy the key from the "Your API Key" box.
- Node.js 22.19 or newer. The Pi installer in step 2 offers to install it if it is missing.
- macOS, Linux or Windows.

### 2. Install Pi

Run this command in a terminal:

```bash
curl -fsSL https://pi.dev/install.sh | sh
```

The installer shows its logo and then asks a few questions:

1. **Install Node.js?** The installer says Pi needs Node.js 22.19.0 or newer and asks whether to install standalone Node.js. Press Enter to accept.
   ![Installer asking to install Node.js](/blog-images/using-pi-with-payperq/01-installer-start.png)
2. **Install Pi?** The screen shows `Pi will install to ~/.pi/agent/bin/pi` and the choices `y` (default) and `n`. Press Enter.
3. **Add Pi to your PATH?** The installer asks whether to add `~/.pi/agent/bin` to your shell profile. Press Enter to accept.
4. **Start pi now?** Type `n` and press Enter. You start Pi in step 4.
   ![Installer finished, asking whether to start Pi](/blog-images/using-pi-with-payperq/07-installer-path.png)

> **Windows:** Pi's docs give this installer for Windows instead: `powershell -c "irm https://pi.dev/install.ps1 | iex"`.

> **Alternative:** if you already have Node.js 22.19 or newer, install from npm with `npm install -g --ignore-scripts @earendil-works/pi-coding-agent`.

Open a new terminal so your shell profile is reloaded, then run this command:

```bash
pi --version
```

The terminal prints a version number such as `1.4.0`.

![pi --version printing the version](/blog-images/using-pi-with-payperq/10-pi-version-new-terminal.png)

### 3. Add PayPerQ as a provider

Open a text editor, create the file `~/.pi/agent/models.json` (the `.pi/agent` folder already exists after step 2) and paste in this content, replacing `<your PayPerQ API key>` with the key from step 1:

```json
{
  "providers": {
    "ppq": {
      "name": "PayPerQ",
      "baseUrl": "https://api.ppq.ai/v1",
      "api": "openai-completions",
      "apiKey": "<your PayPerQ API key>",
      "models": [
        { "id": "anthropic/claude-haiku-5.5", "name": "Claude Haiku 5.5", "input": ["text", "image"], "contextWindow": 1000000 },
        { "id": "claude-sonnet-5.5", "name": "Claude Sonnet 5.5", "input": ["text", "image"], "contextWindow": 1000000 }
      ]
    }
  }
}
```

Pi reads the file when it starts and again each time you open `/model`.

> **Note:** the two models are an example. The full catalog is at [api.ppq.ai/v1/models](https://api.ppq.ai/v1/models), and its format is different from Pi's: copy a model's `id` into `id` and its `name` into `name`, set `contextWindow` from `context_length`, and put `"image"` in `input` only if `architecture.input_modalities` lists `image`. Choose models whose `supported_parameters` include `tools`, because Pi's agent needs tool calling.

> **Note:** keep the key in this file private. If you also store a key for the `ppq` provider through Pi's `auth.json`, Pi uses that one first.

### 4. Start Pi and pick a model

Go to the folder you want Pi to work in (replace `/path/to/your/project` with your real project path) and start it:

```bash
cd /path/to/your/project
```

```bash
pi
```

Pi opens its interface: a prompt editor and a footer with the current folder and model. The footer already shows `anthropic/claude-haiku-5.5`, the first model from your file.

> **Note:** the first time Pi starts it may print `fd not found. Downloading...` and the same for `ripgrep`. Wait for both to finish.

Then choose a model:

1. **Open the model picker.** Type `/model` and press Enter. The list shows `anthropic/claude-haiku-5.5 [ppq]` and `claude-sonnet-5.5 [ppq]`.
   ![Model picker listing both PayPerQ models](/blog-images/using-pi-with-payperq/21-model-picker-fresh.png)
2. **Choose the default.** Move to the model you want and press Ctrl+S. The picker closes and the footer shows the model, which is now saved as the default for new sessions. Press Enter instead to use a model for the current session only.

> **Tip:** run `/model` again at any time to switch models in a running session.

### 5. Send a test prompt

Type this prompt in the Pi editor and press Enter:

```text
Reply with the word OK
```

The model answers `OK` under your prompt.

![Pi answering OK from a PayPerQ model](/blog-images/using-pi-with-payperq/16-test-prompt-answer.png)

The setup is complete. Pi now sends its requests to PayPerQ. Check the cost of each request at [ppq.ai/account-activity](https://ppq.ai/account-activity). To exit Pi, press Ctrl+D on an empty prompt.

## Troubleshooting

**The installer stops at "installing xz-utils" and never continues.** What happened: the standalone Node.js download needs `xz-utils`, and the installer tried `sudo apt-get`, which waits for a sudo password. Likely cause: a minimal Linux system without `xz-utils` and a user without sudo rights. Fix: press Ctrl+C, install `xz-utils` with your package manager as an administrator (on Ubuntu: `sudo apt-get install xz-utils`), and run the installer again.

**`pi: command not found` right after the installer.** What happened: the terminal that ran the installer does not have `~/.pi/agent/bin` in its PATH yet. Likely cause: the PATH change is only read by new shells. Fix: open a new terminal and run `pi --version` again.

**`Error: 401 "Invalid API key"` after sending a prompt.** What happened: PayPerQ rejected the key in `models.json`. Likely cause: the key was pasted incorrectly or the placeholder was not replaced. Fix: copy the key again from [ppq.ai/api-docs](https://ppq.ai/api-docs), correct `apiKey` in `~/.pi/agent/models.json`, open `/model` so Pi reloads the file, and send the prompt again.

**`/model` does not list the PayPerQ models.** What happened: Pi did not load the `ppq` provider. Likely cause: Pi only lists models whose provider has usable authentication, so the file is in the wrong folder or `apiKey` is missing. Fix: check that the file is `~/.pi/agent/models.json` and that `apiKey` holds your key, then open `/model` again.

## Problems?

Please contact us through the customer communication chatbot in the bottom right of the PayPerQ site, in our [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh) or on [Discord](https://discord.gg/BmMntEShYg).
