#!/bin/bash

npm run clean
npm install
npm run build
docker build -t homesensor/gpio:latest .
