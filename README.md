# 🤖 AiBot for MWasyluk.pl

<div align="center">

![AiBot Logo](https://github.com/mWasyluk/react-nodejs_aibot-mwasyluk.pl/assets/75240925/1216a352-9c6b-4b18-aa97-0a1a977f5339)

*An intelligent conversational AI powered by Google's language models*

[Node.js, React, Express, MUI, Styled Components, Nginx]

</div>

## 🌟 Features

- 🧠 Powered by Google's Gemini and PaLM 2 language models
- 🔄 Dynamic model switching during conversations
- 🌓 Light and dark mode support
- 💬 Engaging in both casual and deep intellectual discussions

## 🛠️ Tech Stack

- **Frontend**: React, MUI, styled-components
- **Backend**: Express.js
- **Deployment**: Nginx on VPS, systemctl for background process management

## 🚀 Quick Start

1. Clone the repository and navigate to the project directory:
   ```bash
    git clone https://github.com/mWasyluk/react-nodejs_aibot-mwasyluk.pl.git
    cd react-nodejs_aibot-mwasyluk.pl
   ```

3. Set up the frontend:
   ```bash
    cd app/
    npm install -g npm@latest
    npm install
    npm run build
    npm install -g serve
    ```

5. Set up the backend:
   ```bash
    cd ../server/
    npm install
   ```

7. Set the required environment variables:
   ```bash
    export AIBOT_API_URL='your_api_url'
    export GOOGLE_AUTH_KEY='your_google_auth_key'
   ```

9. Start the application:
    ```bash
    cd ../app/
    serve -s build -l 3000 &
    cd ../server/
    node server.js
    ```

Note: Make sure to set the required environment variables (`AIBOT_API_URL` and `GOOGLE_AUTH_KEY`) before running the application and server.


## 🎨 UI/UX

The project utilizes Material-UI (MUI) as the primary components provider and styled-components for custom styling. This combination allows for a sleek, responsive, and customizable user interface.

## 🧠 AI Models

AiBot leverages two powerful language models from Google:

1. **Gemini**: Cutting-edge model with advanced reasoning capabilities
2. **PaLM 2**: Proficient in various language tasks and knowledge domains

Users can seamlessly switch between these models during a conversation, allowing for diverse perspectives and capabilities within the same chat session.

## 🌐 Deployment

The application is hosted on a VPS using Nginx as the web server. The Express.js backend acts as a middleware between the React frontend and Google's AI services. systemctl ensures the application runs continuously in the background.

## 💡 Use Cases

Whether you're looking for:

- 🎭 Casual chitchat
- 🔬 In-depth discussions on quantum physics
- 🤔 Philosophical debates
- 🤯 And many, many more...

AiBot is equipped to engage in meaningful conversations across a wide range of topics.

---

<div align="center">
  Made with ❤️ by Marek Wasyluk
</div>
