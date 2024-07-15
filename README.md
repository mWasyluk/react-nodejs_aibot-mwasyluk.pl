# 🤖 AiBot for MWasyluk.pl

<div align="center">

![AiBot Logo](https://github.com/mWasyluk/react-nodejs_aibot-mwasyluk.pl/assets/75240925/1216a352-9c6b-4b18-aa97-0a1a977f5339)

*An intelligent conversational AI powered by Google's language models*

https://aibot.mwasyluk.pl

</div>

## 🌟 Features

- 🧠 Powered by Google's Gemini and PaLM 2 language models
- 💬 Engaging in both casual and deep intellectual discussions
- 🤯 Meaningful conversations across a wide range of topics
- 🔄 Dynamic model switching during conversations
- 🌓 Light and dark mode support

## 🛠️ Tech Stack

- **Frontend**: JavaScript, React, MUI, styled-components
- **Backend**: JavaScript, Express.js
- **Deployment**: Git, Docker, Nginx

## 🧠 AI Models

AiBot leverages two powerful language models from Google:

1. **Gemini**: Cutting-edge model with advanced reasoning capabilities
2. **PaLM 2**: Proficient in various language tasks and knowledge domains

Users can seamlessly switch between these models during a conversation, allowing for diverse perspectives and capabilities within the same chat session.


## 🚀 Quick Start

### Option 1: Docker Setup

1. Create and navigate to the project directory

   ```bash
   mkdir -p /path/to/your/project
   cd /path/to/your/project
   ```

2. Clone the repository:
   ```bash
   git clone https://github.com/mWasyluk/react-nodejs_aibot-mwasyluk.pl.git ./
   ```

3. Build the Docker image:
   ```bash
   cd deploy/
   AIBOT_ROOT_DIR=/path/to/your/project bash build.sh
   docker build -t aibot -f deploy.Dockerfile .
   ```

4. Run the Docker container:
   ```bash
   docker run --name aibot --restart unless-stopped -d -p 3000:3000 -p 3001:3001 \
   -e AIBOT_GOOGLE_KEY=your_google_key \
   aibot
   ```

   Note: If you're mapping the container ports to different host ports or using a proxy (e.g., Nginx with proxy_pass), you'll need to set `AIBOT_API_URL` and `AIBOT_APP_URL`:

   ```bash
   docker run --name aibot --restart unless-stopped -d -p 3002:3000 -p 3003:3001 \
   -e AIBOT_APP_URL=http://localhost:3002 \
   -e AIBOT_API_URL=http://localhost:3003/api \
   -e AIBOT_GOOGLE_KEY=your_google_key \
   aibot
   ```

   or
   
   ```bash
   docker run --name aibot --restart unless-stopped -d -p 3000:3000 -p 3001:3001 \
   -e AIBOT_APP_URL=https://your.domain.com \
   -e AIBOT_API_URL=https://your.domain.com/api \
   -e AIBOT_GOOGLE_KEY=your_google_key \
   aibot
   ```
   

### Option 2: Using Pre-built Docker Image

You can also use the pre-built Docker image from the repository:

```bash
docker run --name aibot --restart unless-stopped -d -p 3000:3000 -p 3001:3001 \
-e AIBOT_GOOGLE_KEY=your_google_key \
mwas0122/aibot:1.0.0-build
```

Note: As with Option 1, if you're using different port mappings or a proxy, you'll need to set `AIBOT_API_URL` and `AIBOT_APP_URL` accordingly.

Important: Always ensure that you set the `AIBOT_GOOGLE_KEY` environment variable with your Google API key when running the container.

You can find more about the image and its tags on Docker Hub at [mwas0122/aibot](https://hub.docker.com/repository/docker/mwas0122/aibot/general).

---

<div align="center">
  Made with ❤️ by Marek Wasyluk
</div>
