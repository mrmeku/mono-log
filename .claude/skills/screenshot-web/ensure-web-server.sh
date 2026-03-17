#!/usr/bin/env bash
set -euo pipefail

PORT=8081
TIMEOUT=30
URL="http://localhost:$PORT"

if curl -s -o /dev/null -w "" --connect-timeout 2 "$URL" 2>/dev/null; then
  echo "Expo web server already running at $URL"
  exit 0
fi

echo "Starting Expo web server on port $PORT..."
npx expo start --web --port "$PORT" &>/dev/null &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"

elapsed=0
while [ $elapsed -lt $TIMEOUT ]; do
  if curl -s -o /dev/null -w "" --connect-timeout 2 "$URL" 2>/dev/null; then
    echo "Expo web server ready at $URL"
    exit 0
  fi
  sleep 1
  elapsed=$((elapsed + 1))
done

echo "ERROR: Server failed to start within ${TIMEOUT}s" >&2
kill "$SERVER_PID" 2>/dev/null || true
exit 1
