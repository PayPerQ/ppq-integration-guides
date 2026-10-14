---
title: How to use PPQ's Private (TEE) AI models via our API and with OpenClaw
slug: using-private-tee-models-with-openclaw
date: 2026-10-14
image: /blog-images/using-private-tee-models-with-openclaw/openclaw_private_mode.webp
ogImage: /blog-images/using-private-tee-models-with-openclaw/openclaw_private_mode.webp
intro: You can now use PPQ.AI's private encrypted models via API or in OpenClaw.
author: Matt Ahlborg
tags:
  - Third Party Integrations
  - Privacy
---

## What are "TEE" AI models?

TEE (Trusted Execution Environment) AI models run inside hardware-secured "enclaves" in the cloud. The server operator cannot look inside an enclave, so your queries stay private even from the machine they run on. This is one of the best AI capability-to-privacy tradeoffs available today.

## How does PPQ use enclaves?

According to the project's README, PPQ.AI is by default blind to the content of chat queries: chat requests are served through an AWS Nitro enclave, and PPQ's own backend only sees billing metadata (which key, which model, how many tokens, when). Two kinds of models are involved:

| You ask for | Your request is encrypted to | Who can read your prompt |
|---|---|---|
| A frontier model (Claude, GPT, Gemini, ...) | PPQ's AWS Nitro enclave, which forwards it to the model's provider | The model's provider, not PPQ |
| A `private/*` model | Tinfoil's enclave, where the model itself runs | Nobody but you |

You get this protection with or without any extra software. What the open-source **PPQ Privacy Verifier** (the `ppq-private-mode` proxy) adds is that *you* check it: when it starts, it verifies the enclave's attestation against published code measurements and refuses to send anything if they do not match. After that, every request is encrypted on your machine to a key only the verified enclave holds, and answers are decrypted on your machine. Chat only: image, video, music and other media endpoints are not yet routed through the enclave.

## [→ github.com/PayPerQ/ppq-private-mode-proxy](https://github.com/PayPerQ/ppq-private-mode-proxy)

The proxy supports standalone use with your own code, Claude Code, and OpenClaw.

## Start the proxy (standalone)

You need [Node.js](https://nodejs.org) 20 or newer and your PayPerQ API key from [ppq.ai/api-docs](https://ppq.ai/api-docs).

```bash
PPQ_API_KEY="<your PayPerQ API key>" npx ppq-private-mode
```

The first time, `npx` asks `Need to install the following packages: ppq-private-mode@... Ok to proceed? (y)`. Answer `y`. The proxy verifies the enclaves and then prints that it is listening on `http://127.0.0.1:8787`, with these endpoints: `GET /v1/models`, `POST /v1/chat/completions` (OpenAI format) and `POST /v1/messages` (Anthropic format). Leave it running.

![Proxy start in a terminal](/blog-images/using-private-tee-models-with-openclaw/01-proxy-start.png)

To check that it is running, open `http://127.0.0.1:8787/health`.

Then send requests to it in the normal OpenAI format:

```bash
curl http://127.0.0.1:8787/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"private/kimi-k3","messages":[{"role":"user","content":"Hello"}]}'
```

Requests are billed to the key you started the proxy with. If you see `Invalid API key`, copy the key again from [ppq.ai/api-docs](https://ppq.ai/api-docs) (or create one at [ppq.ai/api-keys](https://ppq.ai/api-keys)).

If the proxy prints `Enclave backend init failed ... PCR0 mismatch` on start, the `private/*` models still work, but frontier models return an error until the problem is fixed. If Tinfoil's enclave fails verification, the proxy does not start.

## Using private models with OpenClaw

> **Status:** the OpenClaw steps below were followed on OpenClaw 2026.10.3 up to enabling the plugin. In our test the plugin's built-in proxy did not start under the gateway (see the troubleshooting note), so if OpenClaw cannot reach the models, use the standalone proxy above and ask the project's issue tracker for help.

1. Install OpenClaw. OpenClaw's own docs require **Node 24.16+ or 26.1+**; with an older Node, npm may quietly install an outdated OpenClaw release. Install with `npm install -g openclaw@latest --allow-scripts=openclaw`, then run `openclaw onboard --install-daemon`.
2. Install the plugin:

   ```bash
   openclaw plugins install ppq-private-mode
   ```

   OpenClaw warns that the plugin comes from outside ClawHub and asks twice for confirmation (the source, then the capabilities: conversation access is denied). Answer `y` to both. The plugin is installed **disabled**.

   ![OpenClaw plugin install prompts](/blog-images/using-private-tee-models-with-openclaw/02-openclaw-plugin-install.png)
3. Put your key and the provider into `~/.openclaw/openclaw.json` (merge, do not overwrite existing settings). The model list below leaves out `private/glm-5-3-flash` on purpose: the proxy serves it, but it is not in PPQ's public model list.

   ```json
   {
     "models": {
       "providers": {
         "ppq-private": {
           "baseUrl": "http://127.0.0.1:8787/v1",
           "apiKey": "unused",
           "api": "openai-completions",
           "models": [
             { "id": "private/kimi-k3", "name": "private/kimi-k3" },
             { "id": "private/gpt-oss-120b", "name": "private/gpt-oss-120b" },
             { "id": "private/llama3-3-70b", "name": "private/llama3-3-70b" },
             { "id": "private/glm-5-3", "name": "private/glm-5-3" },
             { "id": "private/gemma4-31b", "name": "private/gemma4-31b" },
             { "id": "private/deepseek-v4-1-flash", "name": "private/deepseek-v4-1-flash" }
           ]
         }
       }
     },
     "plugins": {
       "entries": {
         "ppq-private-mode": {
           "config": { "apiKey": "<your PayPerQ API key>" }
         }
       }
     }
   }
   ```
4. Enable the plugin and check it: `openclaw plugins enable ppq-private-mode`, then `openclaw plugins list`. (The plugin is installed under `~/.openclaw/npm/projects/`, not `~/.openclaw/extensions/`.)
5. Restart the gateway: `openclaw gateway restart`.
6. Pick a model: `openclaw models set ppq-private/private/kimi-k3` (`openclaw models list` shows the exact names; `ppq-private/private/kimi-k3` is the default after step 3).

Alternatively, paste this into the OpenClaw chat, as the project suggests: *"Please install this skill to enable private models via PPQ: https://github.com/PayPerQ/ppq-private-mode-proxy/blob/main/skills/private-mode/SKILL.md"*.

Troubleshooting: an authentication error usually points to the key, so copy it again from [ppq.ai/api-docs](https://ppq.ai/api-docs) and review your usage at [ppq.ai/account-activity](https://ppq.ai/account-activity). If `plugins inspect ppq-private-mode` reports `plugin must declare contracts.tools before registering agent tools` and nothing listens on port 8787, run the standalone proxy instead.

## Using private models with Claude Code

The proxy also exposes a native Anthropic endpoint (`/v1/messages`), so you can use private models inside **Claude Code**, including tool use and streaming. First install Claude Code (see our [Claude Code guide](https://ppq.ai/blog/using-claude-code-with-payperq)), start the proxy as shown above in one terminal, then in a second terminal:

```bash
export ANTHROPIC_BASE_URL="http://127.0.0.1:8787"
export ANTHROPIC_AUTH_TOKEN="<your PayPerQ API key>"
export ANTHROPIC_MODEL="private/glm-5-3"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="private/glm-5-3-flash"
claude
```

`ANTHROPIC_DEFAULT_HAIKU_MODEL` sets the small model Claude Code uses for background tasks. It replaces `ANTHROPIC_SMALL_FAST_MODEL`, which Claude Code now lists as deprecated (the proxy's own banner still prints the old name). `private/glm-5-3-flash` is served by the proxy (and suggested in its startup banner) but is not in PPQ's public model list, so if it does not work for you, set `ANTHROPIC_DEFAULT_HAIKU_MODEL` to `private/glm-5-3` instead. For a fully private session choose a model that handles tool calls well: `glm-5-3`, `glm-5-3-flash`, `gpt-oss-120b`, `llama3-3-70b` or `kimi-k3`. Note that Anthropic's documentation says it does not support routing Claude Code to non-Claude models through a gateway. Our [full Claude Code guide](https://ppq.ai/blog/using-claude-code-with-payperq) covers VS Code extension setup and more.

## Available Private Models

| Model | Best For |
|-------|----------|
| `private/kimi-k3` | **Recommended.** Moonshot flagship multimodal MoE, reasoning, strong coding, best in openclaw and for agentic tasks. 256K context |
| `private/gpt-oss-120b` | Budget-friendly general use. 131K context |
| `private/llama3-3-70b` | Fast. 131K context |
| `private/glm-5-3` | Agentic engineering, long-horizon tool use, 1M context |
| `private/glm-5-3-flash` | Fast, low-cost vision + reasoning. Served by the proxy, but not yet in PPQ's public model list, so it may not work in clients that read that list |
| `private/gemma4-31b` | Vision-language with built-in thinking mode. 262K context |
| `private/deepseek-v4-1-flash` | Multimodal refresh with vision input, 1M context |

Run `curl http://127.0.0.1:8787/v1/models` to see what your proxy offers.
## What is PayPerQ?

![PayPerQ](/ppqai-opengraph-banner.png)

PayPerQ is a pay-per-query AI service that gives you instant access to hundreds of chat, image, video, and audio AI models in one place. Unlike traditional ChatGPT subscription that charges $20+ per month, PPQ users pay only for what they use—averaging just $4 a month.

Account registration optional. No monthly commitments. Privacy focused. Credit cards and all major cryptos accepted. Just top up with as little as 10 cents and start using premium AI immediately.

### Why Use PayPerQ?

- **Access hundreds of AI models** from all major providers in one place
- **Pay per use** - no subscriptions, no wasted money on unused credits
- **No registration required** - start using AI in seconds
- **Start small** - top up with as little as 10 cents
- **Privacy-first** - conversational data stored locally by default
- **Average cost: ~1 cent per query**

## Getting Started

1. Visit [ppq.ai](https://ppq.ai)
2. Top up your balance (crypto or credit card, as little as 10 cents)
3. Copy your API key from [ppq.ai/api-docs](https://ppq.ai/api-docs) and use it as shown above

No account creation needed—just fund and go.

## Questions?

Contact support via the PPQ.AI chatbot at [ppq.ai](https://ppq.ai) (bottom-right of the site), join the [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh), or the [Discord server](https://discord.gg/BmMntEShYg).
