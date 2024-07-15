#!/bin/bash

# Check if the AIBOT_ROOT_DIR environment variable is set and if it contains the app, server and deploy directories
if [ -z "$AIBOT_ROOT_DIR" ]; then
    echo "ERROR: The AIBOT_ROOT_DIR environment variable is not set. Exiting..."
    exit 1
elif [ ! -d "$AIBOT_ROOT_DIR/app" ] || [ ! -d "$AIBOT_ROOT_DIR/server" ] || [ ! -d "$AIBOT_ROOT_DIR/deploy" ]; then
    echo "ERROR: $AIBOT_ROOT_DIR does not contain the required app, server and deploy directories. Exiting..."
    exit 1
else 
    echo "INFO: AIBOT_ROOT_DIR is set to $AIBOT_ROOT_DIR"
fi

# Check if the AIBOT_DEPLOY_DIR environment variable is set 
if [ -z "$AIBOT_DEPLOY_DIR" ]; then
    echo "ERROR: The AIBOT_DEPLOY_DIR environment variable is not set. Exiting..."
    exit 1
else 
    echo "INFO: AIBOT_DEPLOY_DIR is set to $AIBOT_DEPLOY_DIR"

    if [ ! -d "$AIBOT_DEPLOY_DIR" ]; then
        echo "INFO: $AIBOT_DEPLOY_DIR does not exist - creating..."
        mkdir -p "$AIBOT_DEPLOY_DIR/app" "$AIBOT_DEPLOY_DIR/server"
    fi
fi

# Clean the app and server directories in the deploy directory
echo "INFO: Cleaning $AIBOT_DEPLOY_DIR/app and $AIBOT_DEPLOY_DIR/server directories..."
rm -rf "$AIBOT_DEPLOY_DIR/app"/* "$AIBOT_DEPLOY_DIR/server"/*

# Copy the server files to the deploy directory
cd "$AIBOT_ROOT_DIR/server"
find . -mindepth 1 -maxdepth 1 ! -name node_modules ! -name ".*" -exec cp -rf {} "$AIBOT_DEPLOY_DIR/server/" \;
cd "$AIBOT_DEPLOY_DIR/server"
npm install

# Copy the app build to the deploy directory
cd "$AIBOT_ROOT_DIR/app"
npm install
NODE_ENV=production npm run build
cp -rf build/* "$AIBOT_DEPLOY_DIR/app/"
