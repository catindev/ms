#!/usr/bin/env bash
mongorestore --collection accounts --db MindSalesCRM ~/downloads/MindSalesCRM/accounts.bson
mongorestore --collection numbers --db MindSalesCRM ~/downloads/MindSalesCRM/numbers.bson
mongorestore --collection users --db MindSalesCRM ~/downloads/MindSalesCRM/users.bson
mongorestore --collection contacts --db MindSalesCRM ~/downloads/MindSalesCRM/contacts.bson
mongorestore --collection calls --db MindSalesCRM ~/downloads/MindSalesCRM/calls.bson