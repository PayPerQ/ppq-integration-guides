---
title: Using Kilo Code AI pair programming extension with PayPerQ
slug: using-kilocode-with-payperq
date: 2025-09-03
image: /blog-images/using-kilocode-with-payperq/Screenshot from 2025-09-03 13-16-05.png
ogImage: /blog-images/using-kilocode-with-payperq/Screenshot from 2025-09-03 13-16-05.png
intro: Learn how to set up Kilo Code, the AI-powered VS Code extension for pair programming, to work seamlessly with PayPerQ's API.
author: Matt Ahlborg
tags:
  - Third Party Integrations
---

## What is Kilo Code?

Kilo Code is a powerful VS Code extension that enables AI-powered pair programming by allowing you to interact with AI models directly within your development environment. Similar to Cline, it helps you edit your codebase using natural language commands and provides intelligent code suggestions.

## Step by Step Set Up

### 1. Go to the VSCode extension marketplace and install Kilo Code

Search for "Kilo Code" in the VS Code extensions marketplace and install it.

![Kilo Code Extension](/blog-images/using-kilocode-with-payperq/extension_marketplace.png)

### 2. Configure Kilo Code settings for PayPerQ

Open the Kilo Code settings and configure it to use PayPerQ as your AI provider:

![Kilo Code Settings](/blog-images/using-kilocode-with-payperq/kilocode_settings.png)

Set the following configuration:

- **API Provider**: Select OpenAI Compatible
- **Base URL**: https://api.ppq.ai
- **API Key**: Use the key from ppq.ai/api-docs

### 3. Get your PayPerQ API key

Navigate to ppq.ai/api-docs to find your API key:

![PPQ API](/blog-images/using-kilocode-with-payperq/ppq_api.png)

Copy this key and paste it into the Kilo Code API key field in the settings.

### 4. Start coding with AI assistance

Once configured, you can start using Kilo Code's AI features:

- **Code Generation**: Ask Kilo Code to write functions, classes, or entire modules
- **Code Explanation**: Get detailed explanations of complex code
- **Refactoring**: Request improvements and optimizations to existing code
- **Debugging**: Get help identifying and fixing bugs
- **Documentation**: Generate comments and documentation automatically

## Benefits of Using Kilo Code with PayPerQ

- **Cost-effective**: Pay only for what you use with PayPerQ's flexible pricing
- **Multiple Models**: Access various AI models through PayPerQ's unified API
- **High Performance**: Fast response times for real-time coding assistance
- **Privacy-focused**: Your code stays secure with PayPerQ's privacy-first approach

## Problems?

Please contact us through the customer communication chatbot in the bottom right or in our telegram channel!
