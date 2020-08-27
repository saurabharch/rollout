[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)] [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FKappy-Technologies-LLP%2Frollout.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FKappy-Technologies-LLP%2Frollout?ref=badge_shield)

# Rollout Server

Rollout server is simple drip marketing automation tool which help to enggage more and more users with the website, which have features like

### Feature List

- Push Message Broadcasting
- DDoS Protection

- more coming soon

## [Instrustions](https://kappy-technologies-llp.github.io/rollout/) Commands

> Installing Nodejs , NPM and NVM

- `sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash`
- `~/.nvm/nvm.sh`
- `nvm install node`

> Cross Check Installed Versions

- `node -v`
- `npm -v`
- `nvm --version`

> Clone Source Code

- `git clone https://github.com/Kappy-Technologies-LLP/rollout`
- `npm install`
- `./node_modules/.bin/web-push generate-vapid-keys`
- Generating Vapid Public and Private Key copy it and Update in config folder files [key_dev.js](https://github.com/Kappy-Technologies-LLP/rollout/blob/master/config/keys_dev.js) , [key_prod.js](https://github.com/Kappy-Technologies-LLP/rollout/blob/master/config/keys_prod.js) and also paste your Vapid Public Key in your Service Worker File [app.js](https://github.com/Kappy-Technologies-LLP/rollout/blob/master/public/app.js)
- `node server.js`

## Running Imutable stack with PM2

- `npm install -g pm2`

> Run as root user in Linux

- `sudo pm2 start --name server-name server.js -- --name server-name --port 5500 --watch` - in watch mode or simple
- `sudo pm2 start --name server-name server.js` -- standalone running at by default port 5500 on a single intance
- `sudo pm2 startup` -- save as running always after on every boot performe on system
- `sudo pm2 save` -- save all the setting with pm2

## Setting Up with Nginx Proxy as a load balancer

> PREQUESTS

- `sudo apt-get install nginx`
- `sudo add-apt-repository ppa:certbot/certbot`
- `sudo apt-get update`
- `sudo apt install python-certbot-nginx`
  > Generate SSL Certificate using certbot command
- `sudo certbot --nginx -d serversfault.com -d www.serversfault.com`

> Alternate Command

- `sudo certbot certonly --standalone -d serversfault.com www.serversfault.com`

> Auto Renewal Certficate with certbot

- `sudo certbot --dry-run`

> [More Help Visit Here](https://gist.github.com/saurabharch/24c06cffe23989ff77da6f2b22bf6ddb)

> ALLOW PORTS FOR NGINX AND SETUP FIREWALL

- `sudo ufw default deny incoming`
- `sudo ufw default allow outgoing`
- `sudo ufw allow ssh`
- `sudo ufw allow 'Nginx Full'`
- `sudo ufw delete allow 'Nginx HTTP'`
- `sudo ufw enable`
- `sudo ufw allow http`
- `sudo ufw allow https`
- `sudo ufw status`
- `sudo ufw status` (should say active)

## `sudo ufw allow 443/tcp` (should required)

- `systemctl status nginx`
- `sudo vim /etc/nginx/sites-available/default` (above config applied)
- `sudo ln -s sites-available/rollout sites-available/rollout`
- `sudo nginx -t`
- `sudo service nginx restart`
- `sudo /etc/init.d/nginx reload`

- `sudo journalctl -xe`

### Check nginx service worker status

- `sudo systemctl status nginx`

> installing fail2ban protecting DDoS

- `sudo apt-get install fail2ban`

refere config https://www.webfoobar.com/node/36

> File Structure

```
|
|
|________________________./congif
|                         |
|                         |____keys_prod.js
|                         |
|                         |____keys_dev.js
|                         |
|                         |____keys.js
|
|
|________________________./public
|                         |
|                         |____index.html
|                         |
|                         |____sw.js
|                         |
|                         |____app.js
|
|
|________________________./model
|                         |
|                         |____subscribers_model.js
|
|
|
|________________________./router
|                         |
|                         |____push.js
|                         |
|                         |____subscribe.js
|                         |____keygen.js
|
|___________________________server.js

```

## Notes (Opinionated)

DO NOT do this for a real project of this size, this is to learn.
A Microservice architecture is for BIG projects with a lot of people.

People will tell you that you can do it at small scale and it is true
but you can also remove ants with a nuclear bomb.

Docker containers can be used without using Microservices, they are not the
same thing!

This is the most common way I see people build container based projects
but my personal favourite is using a queue for all container to container
communication.

## Rule of thumb thoughts (Opinionated)

Docker containers = good for almost all project sizes
Microservices = good for big companies with a lot of code and people
Sweetspot = Monolith app and databases in containers

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FKappy-Technologies-LLP%2Frollout.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FKappy-Technologies-LLP%2Frollout?ref=badge_large)

#### [Official site](https://pushgeek.com)  Kappy Pushgeek is made with ❤️ by RainDigi IT Pvt. Ltd.
