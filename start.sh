#!/usr/bin/env bash
git pull
npm run client:build
pm2 start server/index.js --name="bucklog"