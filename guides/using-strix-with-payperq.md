---
title: Using Strix with PayPerQ
slug: using-strix-with-payperq
date: 2026-10-28
image: /blog-images/using-strix-with-payperq/cover.jpg
ogImage: /blog-images/using-strix-with-payperq/cover.jpg
intro: Run Strix, the open-source AI pentesting agent, on pay-per-use PayPerQ models instead of a separate provider subscription.
author: PayPerQ
tags:
  - Third Party Integrations
---

## What is Strix?

Strix is an open-source AI pentesting tool from the usestrix team. Its autonomous agents run your code or a live target dynamically, look for vulnerabilities and validate them with proofs of concept. It is a command-line tool released under the Apache 2.0 license, and it runs its toolkit (HTTP proxy, browser, terminal) inside a Docker sandbox.

Strix talks to models through LiteLLM, so any OpenAI-compatible endpoint works as a provider. This guide points it at PayPerQ, so you pay per request for the model that drives the scan.

## Step by Step Set Up

### 1. Prerequisites

- A PayPerQ account with an API key, from [ppq.ai/api-docs](https://ppq.ai/api-docs), and a funded balance. Strix sends a large first request (its system prompt and tool definitions), and PayPerQ refuses a request when the balance is below the minimum it needs.
- Docker, running. The Strix quick start lists "Docker (running)" as a prerequisite.
- A supported OS. The installer script handles Linux and macOS (x86_64 and arm64) and Windows (x86_64).

### 2. Install Strix

Run the installer in a terminal:

```bash
curl -sSL https://strix.ai/install | bash
```

The installer downloads the `strix` binary into `~/.strix/bin`, adds that folder to your PATH, and pulls the Docker sandbox image `ghcr.io/usestrix/strix-sandbox:1.3.0`. It prints `✓ Strix 1.7.0 ready` (the version number of the release you installed) and, at the end, `Run source ~/.bashrc or open a new terminal`. It asks no questions.

> **Shell profile:** on macOS the default shell is zsh and the profile is `~/.zshrc`; on most Linux distributions it is bash and `~/.bashrc`; on Windows, PowerShell loads the file named by `$PROFILE`. Open a new terminal after editing it.

> **Windows:** the installer script has a Windows x86_64 branch that checks for a MINGW, MSYS or CYGWIN shell and needs `unzip`, so run the command from such a bash shell.

If Docker is not installed or its daemon is not running, the installer says so instead of pulling the image and prints the `docker pull ghcr.io/usestrix/strix-sandbox:1.3.0` command to run once Docker is up.

### 3. Check the install

Open a new terminal, then run:

```bash
strix --version
```

It prints `strix 1.7.0` (or the release you installed).

### 4. Pick a model

Choose a model ID from the [PayPerQ catalog](https://api.ppq.ai/v1/models). Strix is entirely tool-driven (the Strix docs: "every working turn must be a **native** function/tool call"), so pick a model whose `supported_parameters` list includes `tools`.

Strix names models in LiteLLM's `provider/model-name` format, while the catalog lists a bare `id`. For PayPerQ, write `openai/` followed by the catalog `id`: a catalog entry with `"id": "<model ID>"` becomes `openai/<model ID>`.

> **Note:** the catalog's format is different from Strix's: use the catalog `id` field with the `openai/` prefix, because PayPerQ is an OpenAI-compatible endpoint. Prices are in each entry's `pricing` fields and change over time.

### 5. Add PayPerQ as the provider

Create the file `~/.strix/cli-config.json` (the Strix docs: "Strix stores configuration in `~/.strix/cli-config.json`") with this content, replacing `<model ID>` with the catalog `id` you picked and `<your PayPerQ API key>` with your key:

```json
{
  "env": {
    "STRIX_LLM": "openai/<model ID>",
    "LLM_API_BASE": "https://api.ppq.ai",
    "LLM_API_KEY": "<your PayPerQ API key>",
    "STRIX_API_TYPE": "chat_completions"
  }
}
```

> **Windows:** `~` is your user folder, so this file is `%USERPROFILE%\.strix\cli-config.json`.

> **Note:** `LLM_API_BASE` is the custom base URL for an OpenAI-compatible API, and `STRIX_API_TYPE=chat_completions` is the setting the Strix docs give for a gateway that serves chat completions. The key is read from this file, so you do not need to set an environment variable. The next step shows how to confirm Strix picked up the model.

### 6. Run a scan

Run Strix from the folder that contains the project you want to scan. Replace `./your-app` with the path to that project:

```bash
strix --target ./your-app --scan-mode quick --max-budget 0.5
```

> **Note:** a local directory is mounted into the sandbox writable, so the agent edits your real files. The Strix docs say: "Commit or stash first."

Strix opens its terminal interface. The lower-right panel shows the model you configured (`openai/<model ID>`) and the Strix version, and the Agents list shows `Root Agent`. Results are saved to `strix_runs/<run-name>`. `--max-budget 0.5` caps the scan's LLM spend at 0.5 USD; in this interface, reaching the cap pauses the scan.

To see what the scan cost, open [ppq.ai/account-activity](https://ppq.ai/account-activity). To use another model, change `STRIX_LLM` in `~/.strix/cli-config.json`.

### Troubleshooting

**`Error code: 402 - {'error': 'Insufficient credit ... this request requires a minimum balance of $0.0204 and your current balance is $0.0101. Please top up.'}` in the Strix window.** What happened: Strix reached PayPerQ with your key, and PayPerQ refused the request because the balance was below the minimum for it. Strix's requests are large (the Strix docs: "Strix sends a large system prompt plus many tool schemas"), so even a small balance can be too low. Likely cause: the account balance is nearly empty. Fix: add funds at [ppq.ai](https://ppq.ai), then send a message in the Strix input box or start the scan again.

![Strix showing the 402 insufficient credit error](/blog-images/using-strix-with-payperq/04-scan-402-insufficient-balance.png)

## Problems?

Please contact us through the customer communication chatbot in the bottom right of ppq.ai, in our [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh), or on [Discord](https://discord.gg/BmMntEShYg).
