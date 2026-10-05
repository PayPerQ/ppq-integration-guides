---
title: Using OpenWebUI with PayPerQ
slug: using-openwebui-with-payperq
date: 2025-04-02
image: /blog-images/using-openwebui-with-payperq/open_web_ui.png
ogImage: /blog-images/using-openwebui-with-payperq/open_web_ui.png
intro:
author: Matt Ahlborg
tags:
  - Third Party Integrations
---

## What is OpenWebUI?

Open WebUI is an extensible, feature-rich, and user-friendly self-hosted AI interface.

## Step by Step Set Up

### 1. Go to [OpenWebUI](https://openwebui.com/) and install

### 2. Go to the admin panel

![PPQ API](/blog-images/using-openwebui-with-payperq/admin_panel.png)

### 3. Click on settings in admin panel, then click on connections

![PPQ API](/blog-images/using-openwebui-with-payperq/connections.png)

Set OPENAI_API_BASE to: https://api.ppq.ai

Set OPENAI_API_KEY to your key located at [ppq.ai/api-docs](https://ppq.ai/api-docs):

![PPQ API](/blog-images/using-openwebui-with-payperq/ppq_api.png)


### 4. Set model to one available at PayPerQ

![PPQ API](/blog-images/using-openwebui-with-payperq/set_model.png)

## Image Generation & Editing

OpenWebUI supports image generation and editing through the OpenAI Images API spec. Because PayPerQ exposes both `/v1/images/generations` and `/v1/images/edits`, you can use these features directly in OpenWebUI.

### Enabling Image Generation

1. In the OpenWebUI admin panel, go to **Settings → Images**
2. Set the **Image Generation Engine** to **OpenAI DALL·E**
3. Set the **API Base URL** to `https://api.ppq.ai/v1`
4. Enter your PayPerQ API key
5. Set the model to any image model available on PayPerQ (e.g., `nano-banana-2`, `gpt-image-2`)

Once configured, you can generate images directly from the chat interface by clicking the image generation button or asking the model to create an image.

### Image Editing

With the `/v1/images/edits` endpoint, OpenWebUI can also send image editing requests through PayPerQ. Upload an image and provide an editing prompt, and the model will return a modified version. Pricing for image editing is the same as image generation — see the [API docs](https://ppq.ai/api-docs#image-generation) for current model pricing.

## Problems?

Please contact us through the customer communication chatbot in the bottom right or in our telegram channel!
