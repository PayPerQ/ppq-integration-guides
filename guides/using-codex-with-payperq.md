---
title: Using OpenAI Codex with PayPerQ
slug: using-codex-with-payperq
date: 2026-07-10
image: /blog-images/using-codex-with-payperq/cover.jpg
ogImage: /blog-images/using-codex-with-payperq/cover.jpg
intro: Run OpenAI Codex — the CLI, IDE extension, and desktop app — with a pay-per-use PayPerQ API key instead of a ChatGPT subscription. Works with GPT models out of the box, and even Claude, Gemini, and GLM with one extra config line. Fully tested and verified.
author: Matt Ahlborg
tags:
  - Third Party Integrations
  - Tools
---

## What is Codex?

Codex is OpenAI's AI coding agent. It reads your codebase, writes and edits files, runs shell commands, executes tests, and iterates until the job is done — all from your terminal (`codex`), your IDE, or the Codex desktop app. It's OpenAI's answer to Claude Code, and it has become one of the most popular coding agents available.

Normally, Codex wants you to sign in with a ChatGPT Plus/Pro account ($20–$200/month) or plug in an OpenAI platform API key. But Codex also supports **custom model providers** — and PayPerQ is a drop-in one. That means you can run Codex on pure pay-per-use pricing: no subscription, no monthly commitment, topped up with a credit card or crypto.

---

**This guide contains two setup methods:**

- 🖥️ CLI Setup Guide
- 💻 Codex Desktop App Setup Guide

---

## Step by Step Set Up for Codex CLI

### 1. Install Codex

**Using npm:**
```bash
npm install -g @openai/codex
```

**Using brew (macOS):**
```bash
brew install --cask codex
```

### 2. Get Your PayPerQ API Key

Navigate to [ppq.ai/api-docs](https://ppq.ai/api-docs) and copy your API key. You'll need this to authenticate your requests.

### 3. Add PayPerQ to Your Codex Config

Open (or create) `~/.codex/config.toml`. The snippet has two parts, and **where each part goes matters**:

```toml
model = "gpt-5.3-codex"
model_provider = "ppq"

[model_providers.ppq]
name = "PayPerQ"
base_url = "https://api.ppq.ai/v1"
env_key = "PPQ_API_KEY"
wire_api = "responses"
```

- If the file is **new or empty**, paste the snippet exactly as shown.
- If you **already have a config**, split it: the first two lines (`model` and `model_provider`) go at the **very top of the file, above the first `[bracketed]` section header** — replacing any existing `model = "..."` line. The `[model_providers.ppq]` block goes at the **bottom of the file** as its own section.

Why the split: in TOML, a plain `key = value` line belongs to whatever `[section]` header sits above it. If you paste `model = "gpt-5.3-codex"` at the bottom of an existing config, it silently becomes a setting of the last section in the file instead of the global model — and Codex keeps using whatever it was using before, with no error to tell you why.

Also note: `env_key` is the **name of an environment variable** (here, the literal string `PPQ_API_KEY`), not your key itself. Never paste your `sk-...` key into `env_key` — the next step sets the actual key.

That's the whole integration — six lines of provider config.

> **Already use Codex with a ChatGPT login?** Put the PPQ setup in a profile instead, so you can switch on demand:
>
> ```toml
> [profiles.ppq]
> model = "gpt-5.3-codex"
> model_provider = "ppq"
>
> [model_providers.ppq]
> name = "PayPerQ"
> base_url = "https://api.ppq.ai/v1"
> env_key = "PPQ_API_KEY"
> wire_api = "responses"
> ```
>
> Then launch with `codex --profile ppq` when you want pay-per-use, and plain `codex` for your normal account.

### 4. Set Your API Key

Add your key to your shell environment (e.g. in `~/.zshrc` or `~/.bashrc`):

```bash
export PPQ_API_KEY="sk-YOUR_API_KEY_HERE"
```

No `codex login` needed — with a custom provider and `env_key`, Codex skips the ChatGPT sign-in entirely.

### 5. Run Codex

```bash
codex "explain this codebase to me"
```

Or run a hands-free task:

```bash
codex exec --full-auto "add input validation to the API routes and run the tests"
```

### 6. Verify Your Setup

Ask Codex to do something small, then check your usage history at [ppq.ai/account-activity](https://ppq.ai/account-activity) — you'll see each Codex request with its exact cost.

## Step by Step Set Up for the Codex Desktop App

The desktop app and the CLI read the same `~/.codex/config.toml`, so this is mostly the same setup — with two app-specific twists: profiles don't apply (set the model at the top level), and GUI apps launched from the Dock don't inherit your shell's environment variables, so the key goes in a file instead of an `export`.

### 1. Install the Codex App

Download it from [chatgpt.com/codex](https://chatgpt.com/codex) (macOS on Apple Silicon, and Windows). If you already have the CLI installed, `codex app` opens the installer for you. If the app asks you to sign in on first launch, any free ChatGPT account works — once the config below is in place, your coding requests go to PayPerQ, and you can confirm that in your PPQ usage history.

### 2. Get Your PayPerQ API Key

Navigate to [ppq.ai/api-docs](https://ppq.ai/api-docs) and copy your API key.

### 3. Edit Your Codex Config

The desktop app writes its own settings (MCP servers, plugins, trusted projects, `[desktop]`, …) into `~/.codex/config.toml`, so if you've used the app at all, this file already has content. You're adding two separate pieces, **in two different places**:

**Piece 1 — at the very top of the file**, above the first `[bracketed]` section header. If a `model = "..."` line already exists there, replace it:

```toml
model = "gpt-5.3-codex"
model_provider = "ppq"
```

**Piece 2 — at the very bottom of the file**, as its own new sections. Put your real key in the `args` line:

```toml
[model_providers.ppq]
name = "PayPerQ"
base_url = "https://api.ppq.ai/v1"
wire_api = "responses"

[model_providers.ppq.auth]
command = "/bin/echo"
args = ["-n", "sk-YOUR_API_KEY_HERE"]
```

That `auth` block deserves a word of explanation, because the two "obvious" simpler approaches both silently fail in the app — we verified both failures against a live signed-in install:

- The CLI's `env_key` approach fails because GUI apps launched from the Dock don't inherit your shell's environment variables. (Never paste your `sk-...` key into `env_key` either — that field holds an environment variable's *name*, not the key.)
- Inlining the key as an `http_headers` `Authorization` header fails **when you're signed in to ChatGPT** — the app's login token overwrites your custom header, and PayPerQ rejects the OpenAI token with a 401 "API key not found."

The provider-scoped `auth` command is the mechanism that reliably wins over the login token: Codex runs the command and uses its output as the bearer token. `/bin/echo -n` simply prints the key you wrote in the config (macOS/Linux; on Windows, write the key to a small file and use a command that prints it instead). If you'd rather not keep the key in your config file — say you sync or share your dotfiles — put it in a `chmod 600` file and use `command = "/bin/cat"`, `args = ["/absolute/path/to/keyfile"]` instead; both variants are verified working.

**Do not paste piece 1 at the bottom of the file.** In TOML, a plain `key = value` line attaches to whatever `[section]` header is above it — pasted at the bottom, `model` and `model_provider` become settings of the last section (e.g. `[desktop]`) instead of global settings, and the app silently keeps using your ChatGPT subscription. This is the single most common mistake with this setup.

One more detail: the top-level `model` and `model_provider` lines are what the app uses for new chats — profiles (`codex --profile ppq`) are a CLI-only feature. This config works identically in the CLI, so one config covers both.

### 4. Restart the App and Start a New Chat

Quit and relaunch Codex so it picks up the config, then start a **new** chat — existing chats keep the model identity they were created with.

### 5. Verify Your Setup

Ask Codex something small, then check [ppq.ai/account-activity](https://ppq.ai/account-activity) — the request should appear with its exact cost.

### Switching Models in the App

The app's model picker currently doesn't list custom-provider models (a [known](https://github.com/openai/codex/issues/15364) [gap](https://github.com/openai/codex/issues/29156) OpenAI hasn't closed yet). To change models, edit the `model = "..."` line in `config.toml`, restart the app, and start a new chat.

## Which Models Can You Use?

PayPerQ carries the full OpenAI lineup, including the codex-tuned agentic models. Some good choices for Codex:

- `gpt-5.3-codex` — the latest codex-tuned model, our recommended default
- `openai/gpt-5.2-codex` and `openai/gpt-5.1-codex-max` — earlier codex generations
- `openai/gpt-5.1-codex-mini` — budget option for lighter tasks
- `gpt-6.1-sol`, `openai/gpt-5.5`, `openai/gpt-5.4` — general flagship models
- `claude-sonnet-5`, `gemini-3-flash-preview`, `glm-5.2` — yes, really — see the bonus section below

Switch models per-run with the `-m` flag:

```bash
codex -m "openai/gpt-5.1-codex-mini" "fix the failing test"
```

To see the current list of every model on PayPerQ:

```bash
curl https://api.ppq.ai/v1/models
```

## Bonus: Run Claude, Gemini, and GLM Inside Codex

Here's something most guides get wrong: they'll tell you non-OpenAI models don't work in Codex. Out of the box, that's true — point Codex at Claude and you get this error:

```
No endpoints found that support the native `namespace` tool type.
```

The cause: Codex ships some tools as `namespace`-type tools, a Responses API feature only OpenAI's own endpoint understands. Other model providers reject the whole request because of a single such tool. The offenders (verified by tracing actual requests): the multi-agent tools, the app's built-in "codex apps" (documents, hotline, …), and **every MCP server you have configured** — each one becomes a namespace tool.

The fix is to disable those for the session. In a plain CLI setup with no MCP servers, one line does it:

```toml
model = "claude-sonnet-5"
model_provider = "ppq"

[features]
multi_agent = false

[model_providers.ppq]
name = "PayPerQ"
base_url = "https://api.ppq.ai/v1"
env_key = "PPQ_API_KEY"
wire_api = "responses"
```

(Desktop app users: keep the `auth` block from the desktop section instead of `env_key`.)

If you have your own **MCP servers** configured, they count too — each one is sent as a namespace tool, so disable them for non-OpenAI sessions (`enabled = false` in each `[mcp_servers.<name>]` section). And if your config already has a `[features]` section, add `multi_agent = false` to it — a duplicated `[features]` header is a TOML error.

**A candid note about the desktop app:** non-OpenAI models are a poor fit there. The app injects its own plugin and MCP tooling (all namespace-format) on every launch and actively rewrites its sections of `config.toml`, undoing your edits. This is a [known](https://github.com/openai/codex/issues/23186) [upstream](https://github.com/openai/codex/issues/31875) gap — Codex increasingly assumes OpenAI's own backend. Two sane options:

- **Use the CLI for non-OpenAI models** (this page's config works as-is) and keep the app for GPT models with all its plugins intact.
- **Run a translation proxy** like [opencodex](https://github.com/lidge-jun/opencodex) (`npm i -g @bitkyc08/opencodex`), point it at `https://api.ppq.ai/v1` with your PPQ key, and let it translate Codex's OpenAI-only tool formats per provider — its models even show up in the app's model picker. Third-party tool, so evaluate it yourself before trusting it with your key.

With that config we verified full agentic runs — file creation, shell commands, test execution — with:

- `claude-sonnet-5` — Anthropic's latest Sonnet
- `gemini-3-flash-preview` — Google's fast multimodal model
- `glm-5.2` — Z.ai's open-weight coding model

The only thing you give up is Codex's built-in multi-agent orchestration (spawning sub-agents), which is a niche feature. Everything else — the shell tool, file edits, web search — keeps working. You don't need the flag for OpenAI models, but it's harmless to leave on if you switch between models a lot.

## Known Limitations

We believe in honest integration guides, so here is exactly where the edges are:

- **Non-OpenAI models require `multi_agent = false`.** Without it, Claude/Gemini/GLM requests fail with the `namespace` tool error described above. With it, you lose Codex's sub-agent spawning feature for those sessions.
- **Desktop app model switching.** The app's UI model picker doesn't list custom-provider models, so model changes happen in `config.toml` + a new chat (see the desktop app section above).
- **No ChatGPT-specific features.** Cloud tasks tied to a ChatGPT account (Codex Cloud) require OpenAI sign-in and aren't routed through custom providers. Everything local — the CLI, agentic runs, IDE usage — works.

If you'd rather use a coding agent designed around Claude from the start, see our guides for [Claude Code](/blog/using-claude-code-with-payperq), [OpenCode](/blog/using-opencode-with-payperq), [Cline](/blog/using-cline-with-payperq), and [Aider](/blog/using-aider-with-payperq).

## What is PayPerQ?

![PayPerQ](/ppqai-opengraph-banner.png)

PayPerQ is the private way to use the big-name AI models. Chat, image, video and audio models from Anthropic, OpenAI, Google, xAI and the open-source labs, all in one place, with no account and no subscription. You top up a balance with crypto or a card, from as little as 10 cents, and pay only for what you use. Most users spend about $4 a month, against $20+ for a single ChatGPT subscription.

Privacy is built in rather than bolted on. Every chat request is served inside a secure enclave that PayPerQ's servers, staff and logs cannot read into, so PayPerQ never sees your prompts or responses. For the most sensitive work, TEE models run the model itself inside a hardware enclave, so not even the model's host can read your data.

### Why Use PayPerQ?

- **Private by default** - chats are served inside a secure enclave PayPerQ cannot read, and every chat model shows its privacy tier (Anon, ZDR or TEE)
- **No account needed** - no sign-up and no email; a credit id is all it takes
- **Pay with crypto or card** - Bitcoin, Lightning, Monero, stablecoins and more, or a credit card
- **Hundreds of AI models** from every major provider in one place
- **Pay per use** - no subscriptions; top up from 10 cents and pay only for what you use, about 1 cent per query on average
- **Your history stays yours** - conversations are stored on your device by default

## Getting Started

1. Visit [ppq.ai](https://ppq.ai)
2. Top up your balance with crypto or a card (as little as 10 cents)
3. Pick a model, check its privacy tier, and start chatting

No account, no sign-up. Fund and go.

## Problems?

Please contact us through the customer communication chatbot in the bottom right or in our telegram channel!
