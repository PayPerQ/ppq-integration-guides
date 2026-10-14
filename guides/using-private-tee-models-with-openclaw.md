---
title: How to use PPQ's Private (TEE) AI models via our API and with OpenClaw
slug: using-private-tee-models-with-openclaw
date: 2026-10-14
image: /blog-images/using-private-tee-models-with-openclaw/openclaw_private_mode.webp
ogImage: /blog-images/using-private-tee-models-with-openclaw/openclaw_private_mode.webp
intro: Use PPQ.AI's private encrypted models via API, in Claude Code or in OpenClaw, and verify the enclave yourself.
author: Matt Ahlborg
tags:
  - Third Party Integrations
  - Privacy
---

## What are "TEE" AI models?

TEE (Trusted Execution Environment) AI models allow users to run AI queries in the cloud and on remote servers without those servers having access to the content of the users' queries. This delivers one of the best AI capability to privacy tradeoffs in the industry currently.

PPQ's `private/*` models are open-weight models (Kimi, GLM, DeepSeek and others) that run inside a [Tinfoil](https://tinfoil.sh) confidential-computing enclave. Your request is encrypted to the enclave that runs the model, so the prompt is designed to be readable only inside the verified enclave. PPQ still sees billing metadata (which API key, when, which model, how many tokens).

## How to leverage these models using PPQ?

Run PPQ's small open-source proxy on your own machine. Before a request leaves your computer, the proxy checks the attestation of the enclave it is headed for and encrypts the request to a key that only that verified enclave holds. Any OpenAI- or Anthropic-compatible client can then use the proxy instead of talking to PPQ directly.

The code and full documentation live on GitHub:

## [→ github.com/PayPerQ/ppq-privacy-verifier](https://github.com/PayPerQ/ppq-privacy-verifier)

(The repository used to be called `ppq-private-mode-proxy`; the old link redirects. The npm package is still called `ppq-private-mode`.)

### 1. Start the proxy

You need [Node.js](https://nodejs.org) 20 or newer and your PayPerQ API key from [ppq.ai/api-docs](https://ppq.ai/api-docs). Then run:

```bash
PPQ_API_KEY="<your PayPerQ API key>" npx ppq-private-mode
```

The first time, `npx` asks `Ok to proceed? (y)`. Answer `y`. The proxy verifies the enclave and then prints `PPQ Private Mode proxy listening on http://127.0.0.1:8787`. Leave it running. `http://127.0.0.1:8787/health` returns a short JSON status.

### 2. Send a test request

In a second terminal:

```bash
curl http://127.0.0.1:8787/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"private/gpt-oss-120b","messages":[{"role":"user","content":"Reply with the word OK"}]}'
```

You should get a normal OpenAI-style response with `OK` in the message. You can use the same address (`http://127.0.0.1:8787/v1`) as the base URL in any OpenAI SDK.

## Using private models with Claude Code

The proxy also exposes a native Anthropic endpoint (`/v1/messages`), including streaming and tool calls, so you can use private models inside **Claude Code**. First install Claude Code (see the [official setup page](https://code.claude.com/docs/en/setup); on macOS, Linux and WSL the recommended command is `curl -fsSL https://claude.ai/install.sh | bash`). Then, with the proxy from step 1 still running, in a second terminal:

```bash
export ANTHROPIC_BASE_URL="http://127.0.0.1:8787"
export ANTHROPIC_AUTH_TOKEN="<your PayPerQ API key>"
export ANTHROPIC_MODEL="private/glm-5-3"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="private/glm-5-3"
claude
```

`ANTHROPIC_DEFAULT_HAIKU_MODEL` is the model Claude Code uses for background tasks. Claude Code's older `ANTHROPIC_SMALL_FAST_MODEL` variable is deprecated.

On first launch Claude Code asks you to pick a text style, to acknowledge a security note, and to confirm that you trust the folder. Claude Code also shows `Model "private/glm-5-3" isn't recognized · context assumed to be 200k tokens`. This is only a notice: type a prompt and the model answers normally.

For a fully private session pick a model that the proxy documents as supporting tool calls: `private/glm-5-3`, `private/gpt-oss-120b`, `private/llama3-3-70b` or `private/kimi-k3`. PPQ's model catalog metadata for `private/*` models does not list `tools` support, so tool calling is based on the proxy's documentation and we only tested a plain prompt.

![Claude Code answering through the private proxy](/blog-images/using-private-tee-models-with-openclaw/02-claude-code-private-glm.png)

See our [full Claude Code guide](https://ppq.ai/blog/using-claude-code-with-payperq) for VS Code extension setup and more.

## Using private models with OpenClaw

OpenClaw talks to the local proxy as a custom OpenAI-compatible provider.

1. Start the proxy (step 1 above) and leave it running.
2. Install OpenClaw following the [official getting-started guide](https://docs.openclaw.ai/start/getting-started). OpenClaw needs Node.js 24.16+ or 26.1+, and its installer (`curl -fsSL https://openclaw.ai/install.sh | bash`) upgrades Node for you, which can ask for your administrator password. Finish its onboarding (you can skip choosing a model provider there).
3. Add a `ppq-private` provider that points at the proxy. Save the following as `ppq-private.json5`:

```json5
{
  models: {
    providers: {
      "ppq-private": {
        baseUrl: "http://127.0.0.1:8787/v1",
        apiKey: "unused",
        api: "openai-completions",
        models: [
          { id: "private/kimi-k3", name: "private/kimi-k3" },
          { id: "private/gpt-oss-120b", name: "private/gpt-oss-120b" },
          { id: "private/llama3-3-70b", name: "private/llama3-3-70b" },
          { id: "private/glm-5-3", name: "private/glm-5-3" },
          { id: "private/gemma4-31b", name: "private/gemma4-31b" },
          { id: "private/deepseek-v4-1-flash", name: "private/deepseek-v4-1-flash" }
        ]
      }
    }
  }
}
```

   Then apply it:

```bash
openclaw config patch --file ./ppq-private.json5
```

   The `apiKey` here is a placeholder: the proxy holds your PayPerQ key (from the `PPQ_API_KEY` you started it with) and OpenClaw never needs it.
4. Select a private model. OpenClaw model names are `<provider>/<model id>`, so the provider prefix is required:

```bash
openclaw models set ppq-private/private/kimi-k3
```

   (`openclaw models set private/kimi-k3` fails with `Unknown model provider "private"`.)
5. Chat with `openclaw tui` (the gateway must be running, see the OpenClaw guide above).

![OpenClaw TUI answering with a private model](/blog-images/using-private-tee-models-with-openclaw/03-openclaw-tui-private-model.png)

**About the `ppq-private-mode` OpenClaw plugin.** The proxy repository also ships an OpenClaw plugin (`openclaw plugins install ppq-private-mode`) that starts the proxy for you. At the time of writing, OpenClaw 2026.10.3 does not load it (`openclaw plugins doctor` reports `plugin must declare contracts.tools before registering agent tools`), so the proxy never starts. Use the standalone proxy as described above until the plugin is updated.

## Available Private Models

| Model | Best For |
|-------|----------|
| `private/kimi-k3` | **Recommended.** Moonshot flagship multimodal MoE, reasoning, strong coding, best in openclaw and for agentic tasks |
| `private/gpt-oss-120b` | Budget-friendly general use |
| `private/llama3-3-70b` | Fast |
| `private/glm-5-3` | Agentic engineering, long-horizon tool use, 1M context |
| `private/gemma4-31b` | Vision-language with built-in thinking mode |
| `private/deepseek-v4-1-flash` | Multimodal refresh with vision input, 1M context |

`GET http://127.0.0.1:8787/v1/models` lists what the proxy serves.
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
3. Copy your API key from [ppq.ai/api-docs](https://ppq.ai/api-docs)
4. Start the proxy as shown above and use a private model

No account creation needed—just fund and go.

## Questions?

Contact support via the PPQ.AI chatbot at [ppq.ai](https://ppq.ai), or join the [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh) or the [Discord](https://discord.gg/BmMntEShYg) for help.
