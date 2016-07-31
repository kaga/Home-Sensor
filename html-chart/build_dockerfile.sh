#!/bin/bash

npm run clean
npm install
ng build -prod
docker build -t homesensor/html .
