## Wiki For Using and Deployment & Testing


### 🧩 SDK Library

- [Click Here for SDK Library](./api-dev.md)
- [Click Here for API parameters](./api-mgm.md)


### 🚢 deployment

[Click here for Deployment](./deploy.md) .

### 🧪 Testing

- [Click Here for Testing](./testing.md) .


### 🆕📰 Upgrading

[Upgrading Details Here](./upgrading.md)


## Getting Start

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
- More About PM2 Configuration Details [Here](https://pm2.keymetrics.io/docs/usage/quick-start/)

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


[Fail2ban Configuration with Nginx](https://github.com/saurabharch/rollout/blob/master/docs/fail2ban-config.md)

#### OR

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