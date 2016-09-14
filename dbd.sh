#!/usr/bin/env bash
mongodump --out /var/www/bucklog/dbdump --db MindSalesCRM
cd dbdump
zip -r MindSalesCRM.zip MindSalesCRM
