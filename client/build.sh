#!/bin/bash

CompileDaemon \
  -build="yarn esbuild index.tsx --bundle --sourcemap --define:process.env.NODE_ENV=\"development\" --outfile=./public/build.js" \
  -pattern=".+\.tsx?" \
  -color=true \
  /
