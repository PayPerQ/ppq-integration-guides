---
title: Using the pi coding agent with PayPerQ
slug: using-pi-with-payperq
date: 2026-10-05
image: /ppqai-opengraph-banner.png
ogImage: /ppqai-opengraph-banner.png
intro: Use the pi terminal coding agent with a pay-per-use PayPerQ API key by adding PayPerQ as a custom provider in models.json.
author: PayPerQ
tags:
  - Third Party Integrations
---

## What is pi?

[pi](https://pi.dev) is a minimal, terminal-based coding agent harness. You give it a goal and a working folder, and it can read files, run commands, edit content and work through multi-step tasks. It supports many model providers, and PayPerQ is not one of the built-in ones, so you add it as a custom OpenAI-compatible endpoint in a small `models.json` file.

pi does not sandbox its tools: it runs with the permissions of your user. Read pi's [Security](https://pi.dev/docs/latest/security) page before pointing it at untrusted repositories.

## Prerequisites

- A PayPerQ account with credit, and your API key. Open [ppq.ai/api-docs](https://ppq.ai/api-docs): the "Your API Key" box has a copy button, and the "Base URL" box shows `https://api.ppq.ai`. You can create separate keys for different applications at [ppq.ai/api-keys](https://ppq.ai/api-keys).
- Linux or macOS. (pi also has a Windows installer, see the [pi docs](https://pi.dev/docs/latest/windows).)
- On a very minimal Linux image (for example a bare Ubuntu container) install `curl` and `xz-utils` first. The installer downloads Node.js as an `.xz` archive and fails without `xz`.

## Step by Step Set Up

### 1. Install pi

```
curl -fsSL https://pi.dev/install.sh | sh
```

The installer asks whether it may install a standalone Node.js (pi needs Node.js 22.19 or newer), asks to confirm the pi install, and offers to add `~/.pi/agent/bin` to your `PATH` in `~/.bashrc`. Accept the defaults. If you decline the PATH question, run `export PATH="$HOME/.pi/agent/bin:$PATH"`.

If you already have Node.js 22.19+ you can use npm instead:

```
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
```

Check it worked (in a new shell, or after the `export` above):

```
pi --version
```

### 2. Add PayPerQ as a provider

pi has no built-in PayPerQ entry (`/login` will not list it), so create `~/.pi/agent/models.json`:

```json
{
  "providers": {
    "ppq": {
      "baseUrl": "https://api.ppq.ai",
      "api": "openai-completions",
      "apiKey": "$PPQ_API_KEY",
      "models": [
        { "id": "claude-sonnet-5.5", "name": "Claude Sonnet 5.5 (PPQ)" },
        { "id": "gpt-5.4-mini", "name": "GPT-5.4 mini (PPQ)" },
        { "id": "gemini-3.7-flash", "name": "Gemini 3.7 Flash (PPQ)" }
      ]
    }
  }
}
```

- `baseUrl` is the PayPerQ base URL. pi adds `/chat/completions` itself.
- `apiKey` of `"$PPQ_API_KEY"` tells pi to read your key from an environment variable, so the key never sits in a file. Put this in your `~/.bashrc` (or `~/.zshrc`), using the key from [ppq.ai/api-docs](https://ppq.ai/api-docs), and open a new shell:

  ```
  export PPQ_API_KEY=sk-...
  ```

  pi also accepts a literal key in `apiKey`, but then keep `models.json` private.
- The environment variable must exist in the shell that starts `pi`. If it does not, pi shows no models at all (see Troubleshooting).

### 3. Pick a model

Start pi from the folder you want it to work in:

```
cd /path/to/your/project
pi
```

Type `/model` and press Enter. The picker lists the three PayPerQ models under `[ppq]`. Use the arrow keys and Enter to select one, or press Ctrl+S on a model to make it the default for new sessions. pi reloads `models.json` whenever you open `/model`, so you can edit the file and add models without restarting.

Any model from the [PayPerQ catalog](https://api.ppq.ai/v1/models) works as long as you add its exact `id` to `models.json`. pi is a tool-calling agent, so choose a model whose `supported_parameters` include `tools` (all three above do). Some good starting points:

| Model ID | Use it for |
|---|---|
| `claude-sonnet-5.5` | Anthropic's Sonnet, a common pick for coding work |
| `gpt-5.4-mini` | Smaller, lower-priced OpenAI model for everyday tasks |
| `gemini-3.7-flash` | Google's Flash tier, the lowest per-token price of the three in the catalog |

Prices change, so check the current per-token pricing in the catalog or on [ppq.ai](https://ppq.ai).

### 4. Test it

With a model selected, type a prompt at the pi editor, for example:

```
Explain how this repository is structured and how to run its checks.
```

pi shows the actions it takes during a run, such as file reads, searches and commands. You can type `@` in the editor to search for a file instead of typing its path.

To continue the same conversation later, exit pi and run `pi --continue` in the same folder, or use `/resume` to pick an older session.

### 5. Check usage and cost

- PayPerQ side: [ppq.ai/account-activity](https://ppq.ai/account-activity) shows your usage and costs.
- Inside pi: the footer shows context use and the active model, and `/session` lists the message and token counts for the current session.

## Problems?

- **`No models available` or `/model` shows "No matching models".** pi only lists models whose provider has usable authentication. If `apiKey` is `"$PPQ_API_KEY"`, the variable has to be set in the process that starts pi (open a new shell after editing `~/.bashrc`). Check it exists with `env | grep -c PPQ_API_KEY` (prints `1`) without printing the key.
- **`Error: 401 "Invalid API key"`.** The request reached PayPerQ but the key was not accepted. Re-copy the key from [ppq.ai/api-docs](https://ppq.ai/api-docs) and make sure it has no extra characters or spaces. (pi also prints a generic "If this looks like a pi bug, /bug sends a report" hint under this error; it does not mean a bug.)
- **The installer prints `sudo: not found` / "Node.js 22.19.0 or newer is required".** On a minimal Linux image install `xz-utils` as root (`apt-get install -y xz-utils`) and run the installer again.
- **A model ID is rejected.** Copy the `id` exactly from the [catalog](https://api.ppq.ai/v1/models). As pi's docs note, if a compatible endpoint rejects requests, check the API type and compatibility settings in `models.json`.
- **tmux shows "extended-keys is off".** Only a warning if you run pi inside tmux; add `set -g extended-keys on` to `~/.tmux.conf` and restart tmux if modified Enter keys misbehave.

If you are stuck, contact us through the customer communication chatbot in the bottom right of the site, on [Telegram](https://t.me/+ZjJDTazIrV0zNDFh) or on [Discord](https://discord.gg/BmMntEShYg).
