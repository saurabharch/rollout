[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)] [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fsaurabharch%2Frollout.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fsaurabharch%2Frollout?ref=badge_shield)

<p align="center">
  <a href="https://github.com/sponsors/saurabharch">
    <img src="./src/public/images/rollout.gif">
  </a>
</p>

<h3 align="center">
  <a href="/docs"><b>Documentation</b></a> &bull;
  <a href="/README.zh-cn.md"><b>ReadMe in Chinese</b></a> &bull;
  <a href="/README.de-de.md"><b>ReadMe in German</b></a> &bull;
  <a href="/README.pt-br.md"><b>ReadMe in Portuguese</b></a> &bull;
  <a href="https://rolloutco.slack.com/archives/C0454S9BEVB"><b>Slack Community</b></a> &bull;
  <a href="https://twitter.com/rollout"><b>Twitter</b></a>
</h3>


##
<br /><br />

<img align="left" src="./docs/sponsor-banner-homepage.svg" width="50px" />
## 💕 Sponsor Rollout

<a href="https://github.com/sponsors/saurabharch" target="_blank"><img src="/docs/sponsor-banner-readme.png?raw=true" alt="Sponsor Rollout" /></a>

> #  🍵 Buy a coffee for me

<a href='https://ko-fi.com/saurabharch' target='_blank'><img height='35' style='border:0px;height:46px;' src='https://az743702.vo.msecnd.net/cdn/kofi3.png?v=0' border='0' alt='Buy Me a Coffee at ko-fi.com' />
  
- `issuehunt: saurabharch`


## 💰Support

If you need paid support, consulting, or just want support/sponsor the ongoing development of this project, you can in the following ways:

|Description | Link |
|- |:-:|
| Buy a coffee for me | <a href="https://www.buymeacoffee.com/saurabharch" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
| Donate or Book 1 hour consult | [![Buy me a coffee][buymeacoffee-shield]][buymeacoffee]
| Per-minute consulting |   <a href="http://otechie.com/saurabharch"><img src="https://api.otechie.com/consultancy/saurabharch/badge.svg" alt="Consulting"></a>
| Hire me! | [![Consulting Request][consult-shield]][consult]
  
<br /><br />
# PushGeek Rollout Server


Rollout server is simple drip marketing automation tool which help to enggage more and more users with the website, which have features like

## 🚀 Technologies

- 🌐 Express — A web framework for Node.js
- 🎯Bull/BullMQ — Premium Queue package for handling distributed jobs
- 🚂 Handlebars - Html Engine
- 📧 Web-push, nodemailer
- 💽 MongoDB, Redis , Postgres, SQL-light
- 🔀 Nginx
- 🍔 Docker

<br /><br />
<img align="left" src="./docs/Features.svg" width="50px" />
## 💡 Feature List

- ✅ Push Message Broadcasting 👈
- ✅ DDoS Protection 👈
- ✅ Schedule Jobs Worker 👈
- ✅ Fast caches managed 👈
- ✅ OAuth 👈
- ✅ Login With multiple social platform 👈
- ✅ Cart Service 👈
- ✅ Product Display / Service Display 👈
- ✅ International Localization Features 👈
- ✅ Knowledge base 👈
- ✅ Advance Chat Widget Support Service 👈
- ✅ Text Analysis 👈
- ✅ nudity detection 👈
- ✨ more coming soon 👈

<br /><br />

<img align="left" src="./docs/Contributing.svg" width="50px" />

## 📖 Documentation

Documentation is available as a part of rollout preview: https://saurabharch.github.io/rollout/

<br /><br />

<img align="left" src="./docs/Philosophy.svg" width="50px" />

## Getting Started

### 🔥 [Instrustions](https://saurabharch.github.io/rollout/)  🧑🏼‍💻 Commands

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

### OR

```shell
yarn install
```

```shell
./node_modules/.bin/web-push generate-vapid-keys
```

### OR

- bellow command is used setup envriment variable also copy the vapid key from shell terminal and update in .env generated file and update it VAPID_PUBLIC_KEYS => public Key: and VAPID_PRIVATE_KEYS => private Key: , respectively

```shell
cp env.example /config/.env
```

- Generating Vapid Public and Private Key copy it and Update in config folder files [key_dev.js](https://github.com/saurabharch/rollout/blob/master/src/config/keys_dev.js) , [key_prod.js](https://github.com/saurabharch/rollout/blob/master/src/config/keys_prod.js) and also paste your Vapid Public Key in your Service Worker File [app.js](https://github.com/saurabharch/rollout/blob/master/src/public/app.js)

```shell
node src/index.js
```

## APNS Push Certificates 📱

Setup your app for Remote Push Notifications using [the
docs](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/establishing_a_certificate-based_connection_to_apns)
and download the Remote Push Notifications certificate `.cer` files
for Development and Production. Import them both into your keychain.

Open Keychain Access and export both the certificate *and* private key
(highlight them both) to a `.p12` file. I recommend saving them as:

```
apns_dev_Certificates.p12
apns_prod_Certificates.p12
```

Then create the corresponding `.pem` files:

```
#dev
openssl pkcs12 -clcerts -nokeys -out apns_dev_cert.pem -in apns_dev_Certificates.p12
openssl pkcs12 -nocerts -out apns_dev_key.pem -in apns_dev_Certificates.p12

#prod
openssl pkcs12 -clcerts -nokeys -out apns_prod_cert.pem -in apns_prod_Certificates.p12 
openssl pkcs12 -nocerts -out apns_prod_key.pem -in apns_prod_Certificates.p12

# optional to remove passphrase from keys
openssl rsa -in apns_dev_key.pem -out apns_dev_key.unencrypted.pem
openssl rsa -in apns_prod_key.pem -out apns_prod_key.unencrypted.pem
```

Copy the `*.pem` files into the `certs` folder of this repo.

## OR

```shell
./gen-cert.sh example.com
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
<br /><br />

<img align="left" src="./docs/WhatsCool.svg" width="50px" />
## commands and API Integrations wiki 🧩🧪🆕

[Click](./docs/README.md) here for details page.


> ### Tip for Query Performance Testing

Add this

```bash
.explain("executionStats")
```

in query line example as below:

```bash
  db.collectionName.find().explain("executionStats").exec()
```

this command is used in windows🪟 OS close all http running service locally.
```shell
net stop http
```
<br></br>

## Deploy on Heroku 🛫

Deploy with button:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/saurabharch/rollout)

<br></br>

## Work in Action

<h1 align="center">
  <img alt="PushGeek" src="https://raw.githubusercontent.com/saurabharch/rollout/master/docs/screenshot.png?raw=true" width="380px" />
</h1>

## 📝Notes (Opinionated)

DO NOT do this for a real project of this size, this is to learn.
A Microservice architecture is for BIG projects with a lot of people.

People will tell you that you can do it at small scale and it is true
but you can also remove ants with a nuclear bomb.

Docker containers can be used without using Microservices, they are not the
same thing!

This is the most common way I see people build container based projects
but my personal favourite is using a queue for all container to container
communication.

<br></br>

## 🗒️Rule of thumb thoughts (Opinionated)

Docker containers = good for almost all project sizes
Microservices = good for big companies with a lot of code and people
Sweetspot = Monolith app and databases in containers

<br></br>
## 👨🏼‍💻🤓 Author

[Saurabh Kashyap](https://github.com/saurabharch)
  
[buymeacoffee-shield]: https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg
[buymeacoffee]: https://www.buymeacoffee.com/saurabharch
[consult-shield]: https://img.shields.io/badge/Require%20Paid%20Support%20or%20Consulting%3F-Click%20Here-blue?style=for-the-badge&logo=paypal
[consult]: mailto:saurabh@raindigi.com?subject=Rollout%20Consulting

<br></br>
## Community

Join the [slack community](https://rolloutco.slack.com/archives/C0454S9BEVB) to know more about distributed tracing, observability, or SigNoz and to connect with other users and contributors.

If you have any ideas, questions, or any feedback, please share on our [Github Discussions](https://github.com/saurabharch/rollout/discussions)

As always, thanks to our amazing contributors!

<a href="https://github.com/saurabharch/rollout/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=saurabharch/rollout" />
</a>
<br></br>

## 📝 License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fsaurabharch%2Frollout.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fsaurabharch%2Frollout?ref=badge_large)


## 🪴 Project Activity
![Alt](https://repobeats.axiom.co/api/embed/40759511ce401954cc2cff694e540ff9db9cbbe4.svg "Repobeats analytics image")

#### 👋 [Official site](https://raindigi.com)  Pushgeek is made with ❤️ by © RainDigi IT Pvt. Ltd
  
![Visitor Count](https://profile-counter.glitch.me/{saurabharch}/count.svg)

<h3 align="center">Show some &nbsp;❤️&nbsp; by starring of the repository!</h3>
