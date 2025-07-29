#!/bin/sh

# Create config.js with the environment variable
cat <<EOF > /usr/share/nginx/html/config.js
window.env = {
  REACT_APP_BASE_URL: "${REACT_APP_BASE_URL:-http://23.23.80.55:3000/api/v1}"
};
EOF

# Start nginx
exec "$@"
