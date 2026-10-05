---
title: Using OpenCode AI Coding Agent with PayPerQ
slug: using-opencode-with-payperq
date: 2026-03-13
image: /blog-images/using-opencode-with-payperq/opencode-wordmark-light.svg
ogImage: /blog-images/using-opencode-with-payperq/opencode-wordmark-light.svg
intro: Learn how to integrate OpenCode, the open source AI coding agent, with PayPerQ to access premium AI models including Claude Sonnet 4.6, GPT-5.4, and Gemini 3.
author: Thomas Weiss
tags:
  - Third Party Integrations
---

## What is OpenCode?

OpenCode is an open source AI coding agent that helps you write code directly in your terminal, IDE, or desktop application. With OpenCode, you can leverage AI to assist with coding tasks, refactoring, debugging, and more—all through a simple command-line interface or desktop app.

## Why Use PayPerQ with OpenCode?

By connecting OpenCode to PayPerQ's API, you gain access to cutting-edge AI models that are perfect for coding tasks:

- **Claude Sonnet 4.6 & Opus 4.6** - Anthropic's most advanced reasoning models
- **GPT-5.4** - OpenAI's latest models including GPT-5.4 Pro
- **Gemini 3 Pro & Flash** - Google's latest multimodal AI
- **Kimi K2.6** - Moonshot's latest multimodal coding model
- **Big Pickle** - OpenCode's free model (limited time)
- **And many more premium models**

Many OpenCode Zen-recommended models are available through PayPerQ with simple pay-per-use pricing—no subscriptions required.

## Step by Step Set Up

### 1. Install OpenCode

First, install OpenCode using one of the following methods:

**Using curl:**
```bash
curl -fsSL https://opencode.ai/install | bash
```

**Using npm:**
```bash
npm install -g opencode-ai
```

**Using brew (macOS):**

```bash
brew install anomalyco/tap/opencode
```

For more installation options, visit the [OpenCode GitHub repository](https://github.com/anomalyco/opencode).

### 2. Get Your PayPerQ API Key

Navigate to [ppq.ai/api-docs](https://ppq.ai/api-docs) and copy your API key. You'll need this to authenticate your requests.

![OpenCode Welcome](/blog-images/using-opencode-with-payperq/opencode-welcome-banner.png)

### 3. Locate Your OpenCode Config Folder

OpenCode stores its configuration in a platform-specific location:

- **macOS/Linux:** `~/.config/opencode/` (`opencode.jsonc` or `opencode.json`)
- **macOS/Linux (older installs):** `~/.local/share/opencode/` (`opencode.jsonc`)
- **Windows:** Press `WIN+R` and paste `%USERPROFILE%\.config\opencode\`

> **Note:** If the config folder doesn't exist yet, run OpenCode once or create the directory manually.

Navigate to this folder in your terminal or file explorer.

### 4. Create the Configuration File

Create a new file called `opencode.json` in your OpenCode config folder. You can download the complete configuration file here:

**[Download opencode.json](/blog-images/using-opencode-with-payperq/opencode.json)**

Or create it manually with the following content:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "ppq": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "ppq",
      "options": {
        "baseURL": "https://api.ppq.ai",
        "apiKey": "sk-YOUR_API_KEY_HERE",
        "includeUsage": true
      },
      "models": {
        "x-ai/grok-code-fast-1": {
          "name": "x-ai/grok-code-fast-1"
        },
        "anthropic/claude-sonnet-4": {
          "name": "anthropic/claude-sonnet-4"
        },
        "anthropic/claude-sonnet-4.5": {
          "name": "anthropic/claude-sonnet-4.5"
        },
        "claude-sonnet-4.6": {
          "name": "claude-sonnet-4.6"
        },
        "claude-haiku-4.5": {
          "name": "claude-haiku-4.5"
        },
        "anthropic/claude-3.5-haiku": {
          "name": "anthropic/claude-3.5-haiku"
        },
        "claude-opus-4.5": {
          "name": "claude-opus-4.5"
        },
        "claude-opus-4.6": {
          "name": "claude-opus-4.6"
        },
        "anthropic/claude-opus-4.1": {
          "name": "anthropic/claude-opus-4.1"
        },

        "gemini-3-flash-preview": {
          "name": "gemini-3-flash-preview"
        },
        "gemini-3-pro-preview": {
          "name": "gemini-3-pro-preview"
        },
        "google/gemini-3.1-pro-preview": {
          "name": "google/gemini-3.1-pro-preview"
        },

        "minimax/minimax-m2.5": {
          "name": "minimax/minimax-m2.5"
        },

        "z-ai/glm-5": {
          "name": "z-ai/glm-5"
        },

        "moonshotai/kimi-k2.6": {
          "name": "moonshotai/kimi-k2.6"
        },

        "gpt-5.1": {
          "name": "gpt-5.1"
        },
        "gpt-5.1-codex": {
          "name": "gpt-5.1-codex"
        },
        "openai/gpt-5.1-codex-max": {
          "name": "openai/gpt-5.1-codex-max"
        },
        "openai/gpt-5.1-codex-mini": {
          "name": "openai/gpt-5.1-codex-mini"
        },
        "openai/gpt-5": {
          "name": "openai/gpt-5"
        },
        "openai/gpt-5-codex": {
          "name": "openai/gpt-5-codex"
        },
        "gpt-5-nano": {
          "name": "gpt-5-nano"
        },
        "gpt-5.2": {
          "name": "gpt-5.2"
        },
        "gpt-5.2-codex": {
          "name": "gpt-5.2-codex"
        },
        "openai/gpt-5.3-codex": {
          "name": "openai/gpt-5.3-codex"
        },
        "openai/gpt-5.4": {
          "name": "openai/gpt-5.4"
        }
      }
    }
  }
}
```

**Important:** Replace `sk-YOUR_API_KEY_HERE` with your actual PayPerQ API key from [ppq.ai/api-docs](https://ppq.ai/api-docs).

### 5. Launch OpenCode and Select Your Model

Start OpenCode in your terminal or desktop app. To view all available PayPerQ models, use the `/models` command:

```bash
/models
```

![OpenCode Models Command](/blog-images/using-opencode-with-payperq/model-picker.png)

You'll see all the PPQ models listed under the "ppq" provider. Select the model that best fits your coding task.

### 6. Verify Your Setup

Once you start using OpenCode with PayPerQ models, you can verify that requests are being processed by checking your usage history at [ppq.ai/account-activity](https://ppq.ai/account-activity).

## Available Models

The configuration includes all Zen-recommended models that are available through PayPerQ:

- **Claude:** Sonnet 4.6, Opus 4.6, Haiku 4.5
- **GPT:** GPT-5.4, GPT-5.3 Codex, GPT-5.1 Codex
- **Gemini:** 3 Pro, 3 Flash
- **Coding:** Grok Code Fast
- **Reasoning:** Kimi K2.6
- **And many more through the full model list**

Each model has been tested and verified to work with OpenCode through PayPerQ's API.

## Get the Most Recent Models

Want to create your own configuration with the latest models? You can fetch the most up-to-date list of available models directly from PayPerQ's API:

**View all available models:**
```bash
curl https://api.ppq.ai/v1/models
```

This endpoint returns a JSON list of all currently available models on PayPerQ. You can use this to:

1. **Check for new models** - See what's been added since this guide was published
2. **Build custom configs** - Create your own `opencode.json` with specific models you want
3. **Stay updated** - Always have access to the latest AI models as they're released

### Let AI Update Your Configuration Automatically

The easiest way to keep your `opencode.json` file up-to-date is to ask an AI model on PPQ to do it for you! Here's how:

1. **Visit the models API endpoint** in your browser: [https://api.ppq.ai/v1/models](https://api.ppq.ai/v1/models)

2. **Copy the entire JSON response** from the browser page (Ctrl+A or Cmd+A to select all, then copy)

3. **Go to [ppq.ai](https://ppq.ai)** and start a new chat with any AI model

4. **Paste this prompt along with the models data:**

```
I have this list of models from the PPQ API:

[PASTE THE JSON RESPONSE HERE]

Please create an OpenCode configuration file using this EXACT structure. For each model in the API response, extract ONLY the "id" field and add it to the models section:

{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "ppq": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "ppq",
      "options": {
        "baseURL": "https://api.ppq.ai",
        "apiKey": "sk-YOUR_API_KEY_HERE",
        "includeUsage": true
      },
      "models": {
        "z-ai/glm-4.6": {
          "name": "z-ai/glm-4.6"
        },
        "anthropic/claude-sonnet-4": {
          "name": "anthropic/claude-sonnet-4"
        },
        "gpt-5.1-codex": {
          "name": "gpt-5.1-codex"
        }
      }
    }
  }
}

CRITICAL: Each model entry must have the model ID as BOTH the object key AND the "name" property value. Do NOT include any other fields from the API response (like "object", "created", "owned_by", etc.). ONLY use the "id" field.

Process ALL models from the API response in this exact format.
```

5. **The AI will generate a complete configuration** with all current models
6. **Copy the result** and save it as `opencode.json` in your OpenCode config folder
7. **Replace `sk-YOUR_API_KEY_HERE`** with your actual API key from [ppq.ai/api-docs](https://ppq.ai/api-docs)

This method ensures you always have access to the newest models without manually updating the configuration!

**Or download the pre-configured file with all current models (as of March 13, 2026):**

**[Download opencode.json with all current models](/blog-images/using-opencode-with-payperq/opencode.json)**

Note: This file includes all models available at the time of publication. For the most up-to-date model list, use the AI method above or check the API endpoint directly.

## Tips for Best Results

- **Choose the right model:** Use specialized coding models like `openai/gpt-5.3-codex` or `x-ai/grok-code-fast-1` for programming tasks
- **Try the free model:** Big Pickle is free on OpenCode and great for testing
- **Monitor your usage:** Check your PayPerQ dashboard to track API usage and costs
- **Experiment:** Different models excel at different tasks—try a few to find your favorite

## Problems?

Please contact us through the customer communication chatbot in the bottom right or in our telegram channel!
