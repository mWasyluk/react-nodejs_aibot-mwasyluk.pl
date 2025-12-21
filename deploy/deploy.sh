#!/bin/bash

# Check if the required environment variables are set
required_vars=(
    "AIBOT_GOOGLE_KEY",
    "AIBOT_OLLAMA_KEY"
)

allProvided=true

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "ERROR: required $var is not set"
        allProvided=false
    else 
        echo "INFO: required $var is set - using: ${!var}"
    fi
done

if [ "$allProvided" = false ]; then
    echo "ERROR: Not all required env vars are set. Exiting..."
    exit 1
elif [ ! -d "$AIBOT_DEPLOY_DIR/app" ] || [ ! -d "$AIBOT_DEPLOY_DIR/server" ]; then
    echo "ERROR: $AIBOT_DEPLOY_DIR does not contain the required app and server directories. Exiting..."
    exit 1
fi

# Provide default values for optional environment variables
DEFAULT_AIBOT_APP_URL="http://localhost:3000"
DEFAULT_AIBOT_API_URL="http://localhost:3001/api"

declare -A optional_vars=(
    ["AIBOT_APP_URL"]="$DEFAULT_AIBOT_APP_URL"
    ["AIBOT_API_URL"]="$DEFAULT_AIBOT_API_URL"
)

# Check if the optional environment variables are set or use the default values otherwise
for var in "${!optional_vars[@]}"; do
    if [ -z "${!var}" ]; then
        default_value=${optional_vars[$var]}
        echo "INFO: $var is not set - using: $default_value"
        export "$var=$default_value"
    else 
        echo "INFO: $var is set - using: ${!var}"
    fi
done

# Create logs directory and files
mkdir -p "$AIBOT_DEPLOY_DIR/logs"
touch "$AIBOT_DEPLOY_DIR/logs/app.log" "$AIBOT_DEPLOY_DIR/logs/server.log"

# Start the server
cd "$AIBOT_DEPLOY_DIR/server"
export AIBOT_API_PORT=3001
node server.js 2>&1 | tee -a "$AIBOT_DEPLOY_DIR/logs/server.log" &

# Override API_URL for the app
sed -i "s|AIBOT_API_URL: '.*'|AIBOT_API_URL: '$AIBOT_API_URL'|g" "$AIBOT_DEPLOY_DIR/app/config.js"
# Serve the app
cd "$AIBOT_DEPLOY_DIR/app"
npm install -g serve
serve -l 3000 2>&1 | tee -a "$AIBOT_DEPLOY_DIR/logs/app.log"
