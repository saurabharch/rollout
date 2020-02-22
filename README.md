[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FKappy-Technologies-LLP%2Frollout.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FKappy-Technologies-LLP%2Frollout?ref=badge_shield)

# Rollout Server

Rollout server is simple drip marketing automation tool which help to enggage more and more users with the website, which have features like

### Feature List

- Push Message Broadcasting
- DDoS Protection

- more coming soon

## Commands are

- `git clone https://github.com/Kappy-Technologies-LLP/rollout`
- `npm install`
- `node server.js`

## Running Imutable stack with PM2

- `install -g pm2`

> Run as root user in Linux

- `sudo pm2 start --name server-name server.js -- --name server-name --port 5500 --watch` - in watch mode or simple
- `sudo pm2 start --name server-name server.js` -- standalone running at by default port 5500 on a single intance
- `sudo pm2 startup` -- save as running always after on every boot performe on system
- `sudo pm2 save` -- save all the setting with pm2

## Setting Up with Nginx Proxy as a load balancer

> PREQUESTS

- `sudo apt-get install nginx` > `sudo add-apt-repository ppa:certbot/certbot` > `sudo apt-get update`

- `sudo apt install python-certbot-nginx`

- `sudo certbot --nginx -d serversfault.com -d www.serversfault.com`

> Alternate Command

- `sudo certbot certonly --standalone -d serversfault.com www.serversfault.com`

> ALLOW PORTS FOR NGINX AND SETUP FIREWALL

- `sudo ufw default deny incoming`
- `sudo ufw default allow outgoing`
- `sudo ufw allow ssh`
- `sudo ufw allow 'Nginx Full'`
- `sudo ufw delete allow 'Nginx HTTP'`
- `sudo ufw allow enable`
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
