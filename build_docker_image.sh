#!/bin/bash
cmnd="docker build"
cmnd="${cmnd} -t davis8988/birthdays-page-nodejs-14:1.0.1"
cmnd="${cmnd} ."

echo "Executing: ${cmnd} $*"
eval ${cmnd} $*