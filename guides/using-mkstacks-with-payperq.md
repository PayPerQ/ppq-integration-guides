---
title: Using MKStack to Build Nostr Apps with PayPerQ
slug: using-mkstacks-with-payperq
date: 2025-07-22
image: /blog-images/using-mkstacks-with-payperq/mkstacks_og_img.png
ogImage: /blog-images/using-mkstacks-with-payperq/mkstacks_og_img.png
intro: Learn how to build powerful Nostr applications in minutes using MKStack and PayPerQ's AI-powered development tools.
description: Build decentralized social applications on the Nostr protocol using MKStack template and PayPerQ AI assistance
author: Thomas Weiß
tags:
  - Third Party Integrations
  - Nostr
  - React
  - Development Tools
---

## What is MKStack?

MKStack is a powerful React framework template designed to help developers build Nostr client applications in minutes rather than hours or days. Created by Alex Gleason, this comprehensive stack combines modern web development tools including React 18.x, TypeScript, TailwindCSS 3.x, Vite, shadcn/ui, and Nostrify to provide everything you need for rapid Nostr application development.

MKStack is accessed through the Stacks CLI, a command-line interface that makes it easy to scaffold new projects and manage templates.

Nostr (Notes and Other Stuff Transmitted by Relays) is a decentralized protocol for social networks that's gaining significant traction in the Web3 space. With MKStack, you can quickly bootstrap professional Nostr applications without spending time setting up the complex infrastructure typically required.

## Why Use MKStack with PayPerQ?

Combining MKStack with PayPerQ's AI development tools creates a powerful workflow for building Nostr applications:

- **Rapid Prototyping**: Use PayPerQ's AI models to generate Nostr-specific code patterns and components
- **Smart Code Completion**: Get intelligent suggestions for Nostr protocol interactions and React patterns
- **Architecture Guidance**: Leverage AI assistance for structuring your Nostr application's data flow and state management
- **Debugging Help**: Use PayPerQ's AI to troubleshoot Nostr relay connections and message handling

## Step by Step Setup

### 1. Install the Stacks CLI

First, install the Stacks CLI globally on your system:

```bash
npm install -g @getstacks/stacks
```

### 2. Create Your Nostr App with MKStack

Use the MKStack template to bootstrap your new Nostr application:

```bash
stacks naddr1qvzqqqrhl5pzqprpljlvcnpnw3pejvkkhrc3y6wvmd7vjuad0fg2ud3dky66gaxaqqrk66mnw3skx6c4g6ltw
```

This command will create a new project directory with all the necessary dependencies and configuration files.

### 3. Configure PayPerQ for AI-Powered Development

To supercharge your MKStack development with AI assistance, configure your development environment to use PayPerQ:

Set your API endpoint to: `https://api.ppq.ai`

Get your API key from: [ppq.ai/api-docs](https://ppq.ai/api-docs)

You'll need to enter your PayPerQ API key, which starts with `sk-`.

![MKStack CLI Installation](/blog-images/using-mkstacks-with-payperq/mkstacks-installation.png)

### 4. Start Building Your Nostr App

Navigate to your new project directory and start the development server:

```bash
cd your-project-name
npm run dev
```

Your Nostr application template will be running locally, ready for customization and AI-assisted development.

## What's Included in MKStack?

The MKStack template comes pre-configured with:

- **React 18.x**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development for better code quality
- **TailwindCSS 3.x**: Utility-first CSS framework for rapid styling
- **Vite**: Fast build tool and development server
- **shadcn/ui**: Beautiful, accessible UI components
- **Nostrify**: Comprehensive Nostr protocol implementation for JavaScript

## Getting Started with Nostr Development

Once you have your MKStack project set up, you can use PayPerQ's AI models to help you:

1. **Understand Nostr Concepts**: Ask AI to explain Nostr events, relays, and key management
2. **Generate Code Patterns**: Get AI assistance for common Nostr operations like posting notes, following users, and handling reactions
3. **Implement Features**: Use AI to help build features like user profiles, feed algorithms, and real-time updates
4. **Optimize Performance**: Get suggestions for efficient relay management and data caching strategies

## Example Use Cases

With MKStack and PayPerQ, you can quickly build:

- **Social Media Clients**: Twitter-like interfaces for the Nostr network
- **Messaging Applications**: Secure, decentralized chat applications
- **Content Publishing Platforms**: Blog or newsletter platforms on Nostr
- **Community Tools**: Forums, groups, and community management applications
- **Marketplace Applications**: Decentralized commerce platforms

## Problems or Questions?

If you encounter any issues while using MKStack with PayPerQ or have questions about Nostr development, please contact us through:

- The customer communication chatbot in the bottom right corner
- Our [Telegram channel](https://t.me/+ZjJDTazIrV0zNDFh)
- Our [Discord server](https://discord.gg/BmMntEShYg)
- Check out the [MKStack documentation](https://getstacks.dev) for template-specific guidance

Start building the decentralized future today with MKStack and PayPerQ!
