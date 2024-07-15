#!/bin/bash

# Check if the required environment variables are set
required_vars=(
    "AIBOT_GOOGLE_KEY"
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
DEFAULT_AIBOT_DEPLOY_DIR="/aibot"
DEFAULT_AIBOT_APP_URL="http://localhost:3000"
DEFAULT_AIBOT_API_URL="http://localhost:3001/api"

declare -A optional_vars=(
    ["AIBOT_DEPLOY_DIR"]="$DEFAULT_AIBOT_DEPLOY_DIR"
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

# # Extract port from URL or use the provided default value
# extract_port_from_url() {
#     local port=$(echo $1 | cut -d: -f3 | cut -d/ -f1)
#     if [ -z "$port" ]; then
#         echo $2
#     else
#         echo $port
#     fi
# }

# export AIBOT_APP_PORT=$(extract_port_from_url "$AIBOT_APP_URL" 3000)
# export AIBOT_API_PORT=$(extract_port_from_url "$AIBOT_API_URL" 3001)









# # Check if the AIBOT_APP_URL environment variable is set or use the default value otherwise
# if [ -z "$AIBOT_APP_URL" ]; then
#     echo "INFO: AIBOT_APP_URL is not set - using: http://localhost:3000"
#     export AIBOT_APP_URL="http://localhost:3000"
# else 
#     echo "INFO: AIBOT_APP_URL is set - using: $AIBOT_APP_URL"
# fi

# if [[ $AIBOT_APP_URL =~ :[0-9]+ ]]; then
#     export AIBOT_APP_PORT=$(echo "$AIBOT_APP_URL" | grep -oP '(?<=:)[0-9]+')
# else
#     export AIBOT_APP_PORT=3000
# fi

# # Check if the AIBOT_API_PORT environment variable is set or use the default value otherwise
# if [ -z "$AIBOT_API_PORT" ]; then
#     echo "INFO: AIBOT_API_PORT is not set - using: 3001"
#     export AIBOT_API_PORT=3001
# else 
#     echo "INFO: AIBOT_API_PORT is set - using: $AIBOT_API_PORT"
# fi

# Create logs directory and files
mkdir -p "$AIBOT_DEPLOY_DIR/logs"
touch "$AIBOT_DEPLOY_DIR/logs/app.log" "$AIBOT_DEPLOY_DIR/logs/server.log"

# Start the server
cd "$AIBOT_DEPLOY_DIR/server"
# export AIBOT_APP_URL="http://localhost:$AIBOT_APP_PORT"
export AIBOT_API_PORT=3001
node server.js 2>&1 | tee -a "$AIBOT_DEPLOY_DIR/logs/server.log" &

# Serve the app
cd "$AIBOT_DEPLOY_DIR/app"
npm install -g serve
# Override API_URL in config.js
sed -i "s|AIBOT_API_URL: '.*'|AIBOT_API_URL: '$AIBOT_API_URL'|g" "$AIBOT_DEPLOY_DIR/app/config.js"
serve -l 3000 2>&1 | tee -a "$AIBOT_DEPLOY_DIR/logs/app.log"
