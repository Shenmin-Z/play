#!/bin/bash

CompileDaemon \
  -build="go build ./cmd/draw/main.go" \
  -command="./main" \
  -color=true \
  /
