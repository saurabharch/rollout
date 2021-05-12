[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)] [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fsaurabharch%2Frollout.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fsaurabharch%2Frollout?ref=badge_shield)

# PushGeek Rollout Server
<h1 align="center">
  <img alt="PushGeek" src="https://github.com/saurabharch/rollout/blob/master/src/public/images/Pushgeek.gif?raw=true" width="180px" />
</h1>

Rollout server is simple drip marketing automation tool which help to enggage more and more users with the website, which have features like


> #  Buy a coffee for me
<a href="https://www.buymeacoffee.com/saurabharch" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

-  ko_fi: saurabharch
-  issuehunt: saurabharch
-  otechie: saurabharch

## 🚀 Technologies

- ⚡ Express — A web framework for Node.js
- 🐮Bull — Premium Queue package for handling distributed jobs
- 🚒 Handlebars - Html Engine 
- 📧 Web-push, nodemailer
- 🏪 MongoDB, Redis
- 🔀 Nginx
- 🚚 Docker

### ⚡️ Feature List

- Push Message Broadcasting
- DDoS Protection
- Schedule Jobs Worker
- Fast caches managed
- OAuth
- Login With multiple social platform
- Cart Service
- Product Display
- International Localization Features
- Text Analysiss
- nudity detection
- more coming soon

## 🔥 [Instrustions](https://saurabharch.github.io/rollout/)  🧑🏼‍💻 Commands

> Installing Nodejs , NPM and NVM

```shell
 sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
```
```shell
~/.nvm/nvm.sh
```

```shell
 nvm install node
```

> Cross Check Installed Versions

```shell
node -v
```
```shell
npm -v
```
```shell
nvm --version
```

> Clone Source Code

```shell
git clone https://github.com/saurabharch/rollout
```
```shell
npm install
```
##OR
```shell
yarn install
```
```shell
./node_modules/.bin/web-push generate-vapid-keys
```
- Generating Vapid Public and Private Key copy it and Update in config folder files [key_dev.js](https://github.com/saurabharch/rollout/blob/master/src/config/keys_dev.js) , [key_prod.js](https://github.com/saurabharch/rollout/blob/master/src/config/keys_prod.js) and also paste your Vapid Public Key in your Service Worker File [app.js](https://github.com/saurabharch/rollout/blob/master/src/public/app.js)
```shell
node server.js
```

## Running Imutable stack with PM2

```shell
npm install -g pm2
```

> Run as root user in Linux

- in watch mode or simple
```shell
sudo pm2 start --name server-name index.js -- --name server-name --port 5500 --watch
```
- standalone running at by default port 5500 on a single intance
```shell
sudo pm2 start --name server-name index.js
```
- save as running always after on every boot performe on system
```shell
sudo pm2 startup
```
- save all the setting with pm2
```shell
sudo pm2 save
```
- Running Rollout Server using PM2 with babel as interpreter setting is [Here](https://github.com/saurabharch/rollout/wiki/Run-Rollout-Server-using-PM2-server-with-babel-as-interpreter)

## Setting Up with Nginx Proxy as a load balancer

> ✋🏻 PREQUESTS

```shell
sudo apt-get install nginx
```
```shell
sudo add-apt-repository ppa:certbot/certbot
```
```shell
sudo apt-get update
```
```shell
sudo apt install python-certbot-nginx
```

 > Generate SSL Certificate using certbot command
```shell
sudo certbot --nginx -d pushgeek.com -d www.pushgeek.com
```

> Alternate Command

```shell
sudo certbot certonly --standalone -d pushgeek.com www.pushgeek.com
```

> Auto Renewal Certficate with certbot

```shell
sudo certbot --dry-run
```

> [More Help Visit Here](https://gist.github.com/saurabharch/24c06cffe23989ff77da6f2b22bf6ddb)

> ALLOW PORTS FOR NGINX AND SETUP FIREWALL

```shell
sudo ufw default deny incoming
```
```shell
sudo ufw default allow outgoing
```
```shell
sudo ufw allow ssh
```
```shell
sudo ufw allow 'Nginx Full'
```
```shell
sudo ufw delete allow 'Nginx HTTP'
```
```shell
sudo ufw enable
```
```shell
sudo ufw allow http
```
```shell
sudo ufw allow https
```
```shell
sudo ufw status
```
- (should say active)
```shell
sudo ufw status
```

## `sudo ufw allow 443/tcp` (should required)

```shell
systemctl status nginx
```
- (above config applied)
```shell
sudo vim /etc/nginx/sites-available/rollout
```
```shell
sudo ln -s sites-available/rollout sites-enable/rollout
```
```shell
sudo nginx -t
```
```shell
sudo service nginx restart
```
```shell
sudo /etc/init.d/nginx reload
```

```shell
sudo journalctl -xe
```

### Check nginx service worker status

```shell
sudo systemctl status nginx
```

> installing fail2ban protecting DDoS

```shell
sudo apt-get install fail2ban
```

[refere config](https://www.webfoobar.com/node/36)

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

## 👨🏼‍💻 Author

[Saurabh Kashyap](https://github.com/saurabharch)

## 📝 License


[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fsaurabharch%2Frollout.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fsaurabharch%2Frollout?ref=badge_large)

#### 👋 [Official site](https://raindigi.com)  Pushgeek is made with ❤️ by © RainDigi IT Pvt. Ltd.
