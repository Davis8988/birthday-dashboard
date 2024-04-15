#!/bin/bash

# Print the OS of the Docker container
echo "OS of the Docker container:"
cat /etc/os-release
echo PWD=$(pwd)


# List files
echo ''
echo ''
echo ''
echo "Listing files: "
ls -la
echo ''
echo ''
echo ''


# Check if package.json exists
echo "Validating package.json exists"
if [ ! -f "package.json" ]; then
  echo "Error: package.json file not found."
  exit 1
fi

# Print all environment variables sorted
echo ''
echo "Environment variables:"
printenv | sort
echo ''
echo ''
echo ''
echo ''

# Print executing command
echo "Executing: npm run dev"
npm run dev
