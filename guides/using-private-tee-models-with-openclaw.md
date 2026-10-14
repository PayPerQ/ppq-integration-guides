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

TEE (Trusted Execution Environment) AI models allow users to run AI queries in the cloud and on remote servers without those servers having access to the content of the users' queries. This delivers one of the best AI capability to privacy tradeoffs in the industry currently.

## How to leverage these models using PPQ?

Every chat request to PPQ is now served through an AWS Nitro enclave, so PPQ's own backend only sees billing metadata, never the content of your queries. The `private/*` models go one step further: they run inside a [Tinfoil](https://tinfoil.sh) enclave, so not even the model provider can read your prompt. You can call them like any other PPQ model.

If you would rather not take our word for it, run the **PPQ Privacy Verifier**, a small proxy on your own machine. When it starts it checks the enclave's attestation against the published code, and if that does not match it refuses to send anything. Otherwise it encrypts every request on your machine straight to the verified enclave, and neither PPQ.AI nor anyone else can read it. It is open source:

## [→ github.com/PayPerQ/ppq-privacy-verifier](https://github.com/PayPerQ/ppq-privacy-verifier)

(The repository used to be called `ppq-private-mode-proxy`; the old link redirects.) The repository's README explains the privacy design; the setup steps for the proxy, OpenClaw and Claude Code are below. The proxy works standalone with your own code (OpenAI- and Anthropic-compatible clients) as well as inside OpenClaw.

You need a PPQ API key for everything below. Copy it from [ppq.ai/api-docs](https://ppq.ai/api-docs) (it starts with `sk-`).

## Run the proxy

You need Node.js 20 or newer.

```bash
PPQ_API_KEY=sk-your-key npx ppq-private-mode
```

The first time, npx asks `Ok to proceed? (y)`. Answer `y`. After a few seconds you should see:

```
Initializing encrypted connection to secure enclave...
Attestation verified — enclave: inference.tinfoil.sh, code fingerprint: ...
Enclave backend enabled — https://enclave.ppq.ai (PCR0 ..., published)
PPQ Private Mode proxy listening on http://127.0.0.1:8787
Endpoints: GET /v1/models, POST /v1/chat/completions (OpenAI), POST /v1/messages (Anthropic)
```

Leave it running. Check it from a second terminal:

```bash
curl http://127.0.0.1:8787/health
# {"status":"ok","attestation":true,"apiKeyConfigured":true}
```

Then point any OpenAI-compatible client at `http://127.0.0.1:8787/v1`, for example:

```bash
curl http://127.0.0.1:8787/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"private/kimi-k3","messages":[{"role":"user","content":"Hello"}]}'
```

The proxy listens on `127.0.0.1:8787` only. Treat it like your API key: anyone who can reach it can spend your balance. To run it in Docker or change how it is exposed, see the repository's [deployment notes](https://github.com/PayPerQ/ppq-privacy-verifier/blob/main/docs/deployment.md).

## Using private models with OpenClaw

OpenClaw needs Node.js 24.16 or newer (or 26.1+); its installer stops with an error on older versions. Start the proxy as shown above, then add a provider for it to `~/.openclaw/openclaw.json` (merge this into your existing `models.providers`; the `apiKey` here is a placeholder, the proxy uses the key you gave it):

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
          { "id": "private/glm-5-3-flash", "name": "private/glm-5-3-flash" },
          { "id": "private/gemma4-31b", "name": "private/gemma4-31b" },
          { "id": "private/deepseek-v4-1-flash", "name": "private/deepseek-v4-1-flash" }
        ]
      }
    }
  }
}
```

Restart the OpenClaw gateway, then select a model. OpenClaw names it `<provider>/<model id>`, so the provider name comes first:

```bash
openclaw models set ppq-private/private/kimi-k3
```

`openclaw models list` should now show the seven `ppq-private/private/...` models.

**OpenClaw plugin (alternative).** The proxy is also published as an OpenClaw plugin, `openclaw plugins install ppq-private-mode`. OpenClaw asks you to confirm two prompts (installing from outside ClawHub, then accepting the plugin's capabilities) and installs the plugin *disabled* until you add its config (`plugins.entries.ppq-private-mode.config.apiKey`, plus the provider block above) and run `openclaw plugins enable ppq-private-mode`. **Known issue:** when we tested OpenClaw 2026.9.7 with `ppq-private-mode` 0.7.0, `openclaw plugins doctor` reported `plugin must declare contracts.tools before registering agent tools`, the plugin's proxy never started, and requests failed with `connection refused`. Until that is fixed, use the standalone proxy above.

## Using private models with Claude Code

The proxy also exposes a native Anthropic endpoint (`/v1/messages`), so you can use private models directly inside **Claude Code** — including tool use and streaming. Start the proxy, then point Claude Code at it:

```bash
# 1. Start the proxy (leave running)
PPQ_API_KEY=sk-your-key npx ppq-private-mode

# 2. In a second terminal, point Claude Code at the proxy and launch it
export ANTHROPIC_BASE_URL="http://127.0.0.1:8787"
export ANTHROPIC_AUTH_TOKEN="sk-your-key"
export ANTHROPIC_MODEL="private/glm-5-3"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="private/glm-5-3-flash"
claude
```

`ANTHROPIC_DEFAULT_HAIKU_MODEL` sets the model Claude Code uses for background work; it replaces the older `ANTHROPIC_SMALL_FAST_MODEL`, which Anthropic has deprecated.

What to expect on first launch: Claude Code asks you to pick a theme, shows its security notes and asks whether you trust the folder. Because `private/glm-5-3` is not one of Anthropic's own models, it also prints a notice that the model "isn't described by this version's model catalog" and assumes a 200k context window; that is normal. Anthropic does not officially support running Claude Code against non-Claude models, so expect rough edges.

See our [full Claude Code guide](https://ppq.ai/blog/using-claude-code-with-payperq) for VS Code extension setup and more.

## Available Private Models

| Model | Best For |
|-------|----------|
| `private/kimi-k3` | **Recommended.** Moonshot flagship multimodal MoE, reasoning, strong coding, best in openclaw and for agentic tasks |
| `private/gpt-oss-120b` | Budget-friendly general use |
| `private/llama3-3-70b` | Fast |
| `private/glm-5-3` | Agentic engineering, long-horizon tool use, 1M context |
| `private/glm-5-3-flash` | Fast, low-cost vision + reasoning, 1M context |
| `private/gemma4-31b` | Vision-language with built-in thinking mode |
| `private/deepseek-v4-1-flash` | Multimodal refresh with vision input, 1M context |

Coding agents such as Claude Code and OpenClaw need tool calling. The proxy reports tool-call support for `private/kimi-k3`, `private/glm-5-3`, `private/glm-5-3-flash`, `private/gpt-oss-120b` and `private/llama3-3-70b`. The full list of models is at `https://api.ppq.ai/v1/models`.

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
3. Copy your API key from [ppq.ai/api-docs](https://ppq.ai/api-docs) (you can create more keys at [ppq.ai/api-keys](https://ppq.ai/api-keys), and see usage at [ppq.ai/account-activity](https://ppq.ai/account-activity))
4. Select your model and start chatting

No account creation needed—just fund and go.

## Questions?

Contact support via the PPQ.AI chatbot at [ppq.ai](https://ppq.ai) (bottom right), or join the [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh) or [Discord](https://discord.gg/BmMntEShYg) for help.
