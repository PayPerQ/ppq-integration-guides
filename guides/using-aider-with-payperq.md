---
title: Using Aider AI pair programming CLI with PayPerQ
slug: using-aider-with-payperq
date: 2025-03-22
image: /blog-images/using-aider-with-payperq/aider_logo.jpg
ogImage: /blog-images/using-aider-with-payperq/aider_logo.jpg
intro:
author: Matt Ahlborg
tags:
  - Third Party Integrations
---

## What is Aider?

Aider is a command-line tool that enables you to pair program with AI models by editing your codebase in your local git repository using natural language.
## Step by Step Set Up

### 1. Go to [aider](https://aider.chat/docs/install.html) and install

### 2. Set up an ["openAI compatible"](https://aider.chat/docs/llms/openai-compat.html#openai-compatible-apis) API key in aider

Set OPENAI_API_BASE to: https://api.ppq.ai

Set OPENAI_API_KEY to your key located at ppq.ai/api-docs:

![PPQ API](/blog-images/using-aider-with-payperq/ppq_api.png)


### 3. Set model

You can use any model, including non-openAI models, in our "openAI compatible" endpoint.
```
aider --model openai/claude-3.7-sonnet
```


## Problems?

Please contact us through the customer communication chatbot in the bottom right or in our telegram channel!