#!/bin/bash

git clone https://github.com/saurabharch/rollout.git
tar czf rollout.tar.gz server.js package.json package-lock.json workbox-config.js yarn.lock public config router util views model nginx.tmpl mysite.temple kp-push-2020.pem ecosystem.config.js LICENSE
scp rollout.tar.gz pushgeek.com:~
rm rollout.tar.gz

ssh DOMAIN_NAME << 'ENDSSH'
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
