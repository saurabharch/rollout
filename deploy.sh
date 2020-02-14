#!/bin/bash

git clone https://github.com/Kappy-Technologies-LLP/rollout.git
tar czf rollout.tar.gz server.js package.json package-lock.json workbox-config.js yarn.lock public LICENSE
scp rollout.tar.gz rollout.com:~
rm rollout.tar.gz

ssh rollout.com << 'ENDSSH'
pm2 stop all
rm -rf rollout
mkdir rollout
tar xf rollout.tar.gz -C rollout
rm rollout.tar.gz
cd rollout
npm run dev:deploy
npm install
touch acme.json
chmod 600 acme.json
ENDSSH