---
title: Using Strix with PayPerQ
slug: using-strix-with-payperq
date: 2026-10-28
image: /blog-images/using-strix-with-payperq/cover.jpg
ogImage: /blog-images/using-strix-with-payperq/cover.jpg
intro: Run Strix, the open-source AI pentesting tool, on pay-per-use PayPerQ models instead of a separate model subscription.
author: PayPerQ
tags:
  - Third Party Integrations
---

## What is Strix?

Strix is an open-source AI penetration testing tool from the usestrix team. Its agents run your code dynamically, look for vulnerabilities and validate them with working proofs-of-concept, then write the findings to disk. You point it at a local folder, a GitHub repository or a live web application from the command line.

Strix uses LiteLLM for model access, so it can talk to any OpenAI-compatible endpoint. That is how you connect it to PayPerQ and pay per request instead of holding a subscription with a model vendor.

## Step by Step Set Up

### 1. Prerequisites

- A PayPerQ account and API key. Copy the key from [ppq.ai/api-docs](https://ppq.ai/api-docs).
- Docker, running. Strix's Quick Start lists "Docker (running)" as a prerequisite: Strix runs its security tools in a Docker sandbox.
- Linux, macOS or Windows on x86_64, or Linux or macOS on arm64. These are the platforms the official installer script handles.

### 2. Install Strix

Run a command in your terminal:

```bash
curl -sSL https://strix.ai/install | bash
```

The installer downloads the Strix binary, adds it to your PATH, and pulls the sandbox Docker image `ghcr.io/usestrix/strix-sandbox:1.3.0`, which can take a few minutes. When it finishes you see `✓ Sandbox image pulled successfully`, the Strix banner and the line `Run source ~/.bashrc or open a new terminal`.

![Strix installer finished](/blog-images/using-strix-with-payperq/01-install-finished.png)

> **Shell profile:** on macOS the default shell is zsh and the profile is `~/.zshrc`; on most Linux distributions it is bash and `~/.bashrc`; on Windows, PowerShell loads the file named by `$PROFILE`. Open a new terminal after editing it.

> **Alternative:** the Strix Quick Start also offers `pipx install strix-agent`.

### 3. Check the installation

Open a new terminal, then run a command:

```bash
strix --version
```

You see `strix` followed by the installed version, for example `strix 1.7.0`.

### 4. Add PayPerQ as the model provider

You give Strix its model settings with three environment variables. In the terminal where you will run Strix, run these three commands, one at a time. Each command prints nothing; the settings apply to Strix runs started from this terminal, and Strix saves them for later runs (see the note below).

Set the model:

```bash
export STRIX_LLM="openai/deepseek/deepseek-v4.1-flash-1017"
```

> **Note:** `deepseek/deepseek-v4.1-flash-1017` costs $0.3165 per 1M input tokens and $1.266 per 1M output tokens at the time of writing. See [api.ppq.ai/v1/models](https://api.ppq.ai/v1/models) for current prices.

> **Note:** this model is an example. Strix writes models as `provider/model-name` (LiteLLM format), and `openai/` selects the OpenAI-compatible protocol. The catalog at [api.ppq.ai/v1/models](https://api.ppq.ai/v1/models) uses a different format: its `id` field maps to the setting, written after `openai/`. The Strix docs add that frontier OpenAI, Anthropic and Gemini models need a cyber access program for security testing.

Set the PayPerQ base URL:

```bash
export LLM_API_BASE="https://api.ppq.ai"
```

Set your key:

```bash
export LLM_API_KEY="<your PayPerQ API key>"
```

> **Windows:** in PowerShell, `$env:STRIX_LLM = "openai/deepseek/deepseek-v4.1-flash-1017"` sets the variable for the current window only. To keep it for new windows, run `setx STRIX_LLM "openai/deepseek/deepseek-v4.1-flash-1017"` and open a new terminal. Do the same for `LLM_API_BASE = "https://api.ppq.ai"` and `LLM_API_KEY = "<your PayPerQ API key>"`.

> **Note:** Strix saves these settings to `~/.strix/cli-config.json` the first time it runs, so you do not have to export them again for later runs.

### 5. Create a small test project

Create a folder named `strix-demo` and, in it, a file named `app.py` with this content:

```python
import sqlite3
from flask import Flask, request

app = Flask(__name__)


@app.route("/user")
def user():
    name = request.args.get("name", "")
    db = sqlite3.connect("users.db")
    rows = db.execute("SELECT * FROM users WHERE name = '" + name + "'").fetchall()
    return str(rows)
```

> **Note:** Strix mounts a local target folder into its sandbox, writable, so the agent can edit the real files in it. The Strix CLI reference says to commit or stash your work first. A throwaway folder like this one avoids that risk.

You now have `strix-demo/app.py` ready as the scan target.

### 6. Run a scan

Run a command from the folder that contains `strix-demo`:

```bash
strix --target ./strix-demo --scan-mode quick --max-turns 6
```

Strix opens a terminal interface in the same terminal. Within a minute or so the root agent starts answering and running commands in the sandbox, such as `ls -la` and `cat -n app.py`. The lower-right panel shows `openai/deepseek/deepseek-v4.1-flash-1017`: this is the PayPerQ model answering.

![Strix root agent working with the PayPerQ model](/blog-images/using-strix-with-payperq/04-agent-working.png)

The scan runs several minutes. It is finished when the footer shows `Agent completed` and the Findings panel lists a finding, here a SQL injection in the `name` parameter of `/user`. Strix saves the results in `strix_runs/<run-name>`.

![Strix scan completed with one finding](/blog-images/using-strix-with-payperq/10-max-turns-completed.png)

> **Note:** `--max-turns 6` limits each agent to 6 turns, which keeps this first scan short and cheap. The default is 500 turns per agent. The CLI reference also describes `--max-budget`, but calls its cost figure a best-effort estimate from token usage and model pricing, so combine it with a turn limit.

Setup is complete: Strix now runs its scans on a PayPerQ model. Check what each scan cost at [ppq.ai/account-activity](https://ppq.ai/account-activity). To use another model, change `STRIX_LLM` to `openai/` followed by another `id` from the catalog and start Strix again.

### Troubleshooting

**The terminal interface shows no new activity for about five minutes, then continues.** What happened: a model request received no data from the stream. Strix logs `model stream produced no event for 300s; abandoning the turn`, then replays the turn automatically. Likely cause: the model request stalled. Fix: wait; the scan resumes on its own. `LLM_TIMEOUT` (default 300 seconds) sets how long Strix waits per request.

**`LLM CONNECTION FAILED` at startup.** What happened: the startup connection check did not get an answer from the model within `LLM_PREFLIGHT_TIMEOUT` (default 30 seconds), according to the Strix configuration reference. Likely cause: a wrong `LLM_API_BASE`, `LLM_API_KEY` or `STRIX_LLM` value, or a slow model. Fix: check the three values from step 4 and the model `id` against [api.ppq.ai/v1/models](https://api.ppq.ai/v1/models), then run the scan again.

## Problems?

Please contact us through the customer communication chatbot in the bottom right of the PayPerQ site, in our [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh) or on [Discord](https://discord.gg/BmMntEShYg).

This guide is open source. If a step no longer works, open [the guide on GitHub](https://github.com/PayPerQ/ppq-integration-guides/blob/main/guides/using-strix-with-payperq.md) and use the pencil icon to propose a fix, or [open an issue](https://github.com/PayPerQ/ppq-integration-guides/issues); changes go live after a PayPerQ maintainer reviews them.
