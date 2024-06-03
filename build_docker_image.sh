#!/bin/bash
cmnd="docker build"
cmnd="${cmnd} -t artifactory.esl.corp.elbit.co.il/aerospace-simulators-devops-docker/birthdays-page-nodejs-14:1.0.3"
cmnd="${cmnd} ."

echo "Executing: ${cmnd} $*"
eval ${cmnd} $*