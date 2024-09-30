#!/bin/bash

export GIT_REPOSITORY__URL="$GIT_REPOSITORY__URL"

# Ensure the GIT_REPOSITORY__URL is set
if [ -z "$GIT_REPOSITORY__URL" ]; then
  echo "Error: GIT_REPOSITORY__URL is not set."
  exit 1
fi

# Clone the git repository to the specified output directory
git clone "$GIT_REPOSITORY__URL" /home/app/output

# Run the Node.js file
exec node script.js
