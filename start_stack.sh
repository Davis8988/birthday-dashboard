#!/bin/bash
cmnd="docker-compose up -d"

echo "Executing: ${cmnd} $*"
eval ${cmnd} $*