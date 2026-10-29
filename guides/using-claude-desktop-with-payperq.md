---
title: Using Claude Desktop with PayPerQ
slug: using-claude-desktop-with-payperq
date: 2026-04-23
updated: 2026-10-28
image: /blog-images/using-claude-desktop-with-payperq/claude_desktop_cowork_og_1200x630_compressed.jpg
ogImage: /blog-images/using-claude-desktop-with-payperq/claude_desktop_cowork_og_1200x630_compressed.jpg
intro: Learn how to point Claude Desktop at PayPerQ using the built-in Third-Party Inference Gateway, so you can pay per use with crypto and avoid a Claude subscription.
author: Matt Ahlborg
tags:
  - Third Party Integrations
---

## What is Claude Desktop?

Claude Desktop is Anthropic's official desktop application for Mac and Windows, with a Linux beta for Ubuntu and Debian. It gives you the Claude experience in a native app, outside the browser. Anthropic documents a third-party inference mode for it, which routes the app's requests to a gateway you configure instead of to Anthropic.

## Why Use PayPerQ with Claude Desktop?

Claude Desktop normally requires a paid Claude subscription billed to a credit card. By pointing it at PayPerQ's API, you can:

- **Skip the subscription** — top up with crypto and pay for the tokens you use
- **Keep using the Claude Desktop app** you already know, with PayPerQ doing the inference
- **Choose among the Claude models PPQ serves** (Sonnet, Opus, Haiku and more) from the app's model picker
- **Keep spending visible** through your PPQ account activity page

---

## Step by Step Setup

### 1. Install Claude Desktop

**macOS and Windows:** download Claude Desktop from [claude.com/download](https://claude.com/download) and install it.

**Linux (beta, Ubuntu 22.04 or later, or Debian 12 or later, x86_64 or arm64):** Anthropic's [Linux instructions](https://code.claude.com/docs/en/desktop-linux) install it from their apt repository. Run:

```bash
sudo curl -fsSLo /usr/share/keyrings/claude-desktop-archive-keyring.asc https://downloads.claude.ai/claude-desktop/key.asc
gpg --show-keys /usr/share/keyrings/claude-desktop-archive-keyring.asc
echo "deb [arch=amd64,arm64 signed-by=/usr/share/keyrings/claude-desktop-archive-keyring.asc] https://downloads.claude.ai/claude-desktop/apt/stable stable main" | sudo tee /etc/apt/sources.list.d/claude-desktop.list
sudo apt update && sudo apt install claude-desktop
```

The `gpg` command should print the fingerprint `31DDDE24DDFAB679F42D7BD2BAA929FF1A7ECACE`. After the install, `claude-desktop` is on your path:

![Anthropic apt repository, signing key fingerprint and installed claude-desktop package](/blog-images/using-claude-desktop-with-payperq/01-apt-install-check.png)

Launch Claude Desktop, but **do not sign in or create an Anthropic account**: Anthropic's single-machine setup instructions say to configure the gateway first.

### 2. Get your PayPerQ API key

Navigate to [ppq.ai/api-docs](https://ppq.ai/api-docs) and copy your API key. It starts with `sk-`.

### 3. Enable Developer Mode

In Claude Desktop, open the **Help** menu, then **Troubleshooting**, and click **Enable Developer Mode…**. On Windows, the menu is under the application menu (☰) in the top-left of the sign-in screen, according to Anthropic's docs.

A confirmation dialog asks **Enable Developer Mode?** Click **Enable**.

![The Enable Developer Mode confirmation dialog](/blog-images/using-claude-desktop-with-payperq/03-enable-developer-mode-dialog.png)

Claude Desktop restarts, and a new **Developer** menu appears in the menu bar.

![Menu bar with the new Developer menu](/blog-images/using-claude-desktop-with-payperq/04-developer-menu-appears.png)

### 4. Open the Third-Party Inference window

From the **Developer** menu, choose **Configure Third-Party Inference…**.

![Developer menu with Configure Third-Party Inference](/blog-images/using-claude-desktop-with-payperq/05-developer-menu-configure-third-party.png)

A window titled **Configure third-party inference** opens on the **Connection** section.

![The Configure third-party inference window](/blog-images/using-claude-desktop-with-payperq/06-third-party-config-window.png)

### 5. Enter your PayPerQ gateway credentials

In **Connection**, make sure the provider dropdown at the top shows **Gateway**. Under **Gateway credentials**, fill in the fields in this order:

- **Credential kind:** `Static API key`
- **Gateway base URL:** `https://api.ppq.ai`
- **Gateway API key:** `<your PayPerQ API key>`
- **Gateway auth scheme:** `bearer`

![Gateway credentials filled in for PayPerQ, with the API key masked](/blog-images/using-claude-desktop-with-payperq/08-gateway-credentials-filled.png)

> **Note:** **Credential kind** lets you pick where Claude Desktop gets its credential (Static API key, Interactive sign-in, Identity provider sign-in (OIDC) or Helper script). The field's help text says: "When set, only that source is used (no fallback)." For a PayPerQ key, choose **Static API key**.

### 6. Test the connection

Click **Test connection**. A result panel should show both lines below. The number of models can differ.

- `Model discovery — found <n> models`
- `Inference — 1-token completion in <n> ms (<model ID>) · via static key`

![Test connection result: model discovery and a 1-token inference through the static key](/blog-images/using-claude-desktop-with-payperq/10-test-connection-result.png)

The inference line means PayPerQ answered a real (1-token) request with your key.

### 7. Apply the configuration and restart

Click **Apply Changes**, then **Save & Restart** in the dialog that asks "Save & Restart?".

![Save & Restart dialog](/blog-images/using-claude-desktop-with-payperq/11-save-and-restart-dialog.png)

Claude Desktop relaunches. Per Anthropic's docs, "the sign-in screen now offers the option to start in Claude Desktop on 3P using the configuration you entered": choose that option if the sign-in screen appears. The main screen then shows **You're using Gateway**, and the account area at the bottom left reads **Gateway**.

![Claude Desktop after the restart, showing You're using Gateway](/blog-images/using-claude-desktop-with-payperq/12-after-restart-using-gateway.png)

### 8. Check the model list and pick a model

Open the model picker in the message box. It lists the models Claude Desktop discovered from PayPerQ's model list at `https://api.ppq.ai/v1/models`, by their PayPerQ model ID. Look for `anthropic/claude-haiku-5.5` in the list.

![Model picker listing PayPerQ model IDs](/blog-images/using-claude-desktop-with-payperq/13-model-picker-ppq-models.png)

Choose `anthropic/claude-haiku-5.5`.

> **Note:** At the time of writing, `anthropic/claude-haiku-5.5` costs $0.1055 per 1M input tokens and $0.5275 per 1M output tokens. See [api.ppq.ai/v1/models](https://api.ppq.ai/v1/models) for current prices.

The IDs above are examples; the full list is the [PayPerQ model catalog](https://api.ppq.ai/v1/models). Claude Desktop reads that catalog directly. Anthropic's docs say auto-discovery shows only models whose IDs are recognizably Claude. They also describe an optional **Model list** setting (below the Test connection panel, under **Models**) that replaces discovery with your own list. Its format is not the catalog's: each entry's `name` must be the exact model `id` the catalog returns.

### 9. Send a test message

Open a new conversation and send:

```text
Reply with the word OK
```

If the screen shows a **Project or folder** selector, pick an empty folder first, then send the message.

![The model picker set to anthropic/claude-haiku-5.5 with the test prompt typed](/blog-images/using-claude-desktop-with-payperq/14-haiku-selected-prompt-typed.png)

### 10. Verify your setup

Head to [ppq.ai/account-activity](https://ppq.ai/account-activity) and confirm that the request shows up in your usage history. If it does, the gateway is wired up correctly.

---

## Claude Code via PayPerQ

If you also use Claude Code (the CLI / VS Code companion to Claude Desktop), the same principle applies: point its `ANTHROPIC_BASE_URL` at `https://api.ppq.ai` and set `ANTHROPIC_AUTH_TOKEN` to your PPQ key. We have a dedicated walkthrough here:

**[Using Claude Code with PayPerQ](/blog/using-claude-code-with-payperq)**

---

## Troubleshooting

- **The Gateway option or the Developer menu isn't there.** Update Claude Desktop to the latest version ([claude.com/download](https://claude.com/download); on Linux, see Anthropic's [Linux instructions](https://code.claude.com/docs/en/desktop-linux)). Make sure you clicked **Enable Developer Mode…** under Help > Troubleshooting and confirmed with **Enable**.
- **The Developer menu disappeared after the restart.** Anthropic's docs say that if you turned on Developer mode before the app relaunched into a third-party configuration, the menu is gone after the relaunch. Go to **Help > Troubleshooting > Enable Developer Mode…** again and it stays on from then on.
- **The standard claude.ai sign-in screen shows instead of the gateway.** Anthropic's docs list a configuration applied while the app was running as a cause. Fully quit Claude Desktop and relaunch it.
- **Test connection or requests fail with an auth error (401).** Double-check that:
  - **Credential kind** is `Static API key`, since a different credential kind uses a different source for the credential.
  - The base URL is `https://api.ppq.ai`.
  - The auth scheme is `bearer`.
  - The API key is pasted without extra whitespace, is your PayPerQ key (it starts with `sk-`) and has not been revoked on [ppq.ai/api-keys](https://ppq.ai/api-keys).
- **Requests fail with "insufficient credits".** Top up at [ppq.ai/top-up](https://ppq.ai/top-up).
- **A model isn't showing up.** Fetch the current list directly from `https://api.ppq.ai/v1/models` and confirm the model you expect is live. Discovery lists models whose IDs are recognizably Claude, so add other IDs through the **Model list** setting.

## Tips for Best Results

- **Feel free to experiment with other models, but fall back to Claude if they misbehave.** Claude Desktop's model discovery lists models with Claude IDs, such as `anthropic/claude-haiku-5.5`, `claude-sonnet-5.5` and `claude-opus-5.5`. Prices differ between them, so check the [catalog](https://api.ppq.ai/v1/models) first.
- **Monitor your usage.** [ppq.ai/account-activity](https://ppq.ai/account-activity) shows per-request spend so you can see exactly where your credits are going.
- **Use Claude Code for coding tasks.** For in-repo coding work, pair Claude Desktop with Claude Code against the same PPQ key.

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
3. Select your model and start chatting

No account creation needed—just fund and go.

## Problems?

Please contact us through the customer communication chatbot in the bottom right of the PayPerQ site, in our [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh) or on [Discord](https://discord.gg/BmMntEShYg).

This guide is open source. If a step no longer works, open [the guide on GitHub](https://github.com/PayPerQ/ppq-integration-guides/blob/main/guides/using-claude-desktop-with-payperq.md) and use the pencil icon to propose a fix, or [open an issue](https://github.com/PayPerQ/ppq-integration-guides/issues); changes go live after a PayPerQ maintainer reviews them.
