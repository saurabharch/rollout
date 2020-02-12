#!/bin/bash

tar czf rollout.tar.gz main.js package.json yarn.lock public LICENSE
scp rollout.tar.gz rollout.com:~
rm rollout.tar.gz

ssh rollout.com << 'ENDSSH'
pm2 stop all
rm -rf rollout
mkdir easyio
tar xf rollout.tar.gz -C rollout
rm rollout.tar.gz
cd rollout 
yarn install
pm2 start all
ENDSSH