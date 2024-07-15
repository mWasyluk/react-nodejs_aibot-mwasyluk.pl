# Use light version of Node.js as the base image
FROM node:lts-slim

RUN npm install -g npm@latest

# Copy the bash script responsible for preparing and starting the app to the container
# Remember to place the deploy.sh file in the build context
COPY deploy.sh /deploy.sh
COPY app /aibot/app
COPY server /aibot/server

WORKDIR /aibot
ENV AIBOT_DEPLOY_DIR /aibot

EXPOSE 3000

# Execute the bash script every time the container starts
CMD ["bash", "/deploy.sh"] 
