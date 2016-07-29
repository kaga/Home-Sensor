#!/bin/bash

npm run clean
docker build -t homesensor/api .
