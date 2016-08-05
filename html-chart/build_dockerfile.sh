#!/bin/bash

npm run clean
npm install
npm run build-production
docker build -t homesensor/html .
