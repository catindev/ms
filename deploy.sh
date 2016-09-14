#!/usr/bin/env bash
git pull
pm2 restart mindsales
pm2 flush