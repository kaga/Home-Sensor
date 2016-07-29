#!/bin/bash

npm run clean
docker build -t homesensor/reporter .
