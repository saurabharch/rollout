
# Docker compose

## Installation

```
sudo curl -L https://github.com/docker/compose/releases/download/1.18.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

docker-compose up -d --force-recreate --build

```

# Docker Compose:

sudo docker-compose up --force-recreate --build


sudo docker-compose up  --env-file ./.env.list --force-recreate --build

# Docker:

## Build the Docker Image

```
docker build -t saurabharch/rollout-server .

```

## Run Docker Container

```
docker run -p 5500:5500 saurahbarch/rollout-server
```

## Usefull commands
```
docker images
docker ps
```

# Remove Container
```
docker container ls -a
docker container rm id 
```


```
docker run --name my-mongo -d mongo
sudo docker run --env-file ./.env.list --link my-mongo:mongo rollout-server
```


Example .env.list file

FIREBASE_APIKEY=123
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-a0r162123@chat21-pre23-01.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMXYX
FIREBASE_PROJECT_ID=tiledesk321-pre-01
DATABASE_URI=mongodb://mongo/test


# Tag an image referenced by Name and Tag
To tag a local image with name “httpd” and tag “test” into the “fedora” repository with “version1.0.test”:

docker tag rollout-server:test saurabharch/rollout-server:version1.0.5.test

## Publish docker image

docker login with username (not email) and password 
docker push saurabharch/rollout-server:latest

https://buddy.works/guides/how-dockerize-node-application


== NOT USED ==

docker run --name my-rollout-server --link my-mongo:mongo -d rollout-server -e FIREBASE_CONFIG_FILE=<FIREBASE_CONFIG_PATH.json> -e DATABASE_URI=mongodb://localhost/test


sudo docker run --name my-rollout-server --link my-mongo:mongo -d rollout-server -e FIREBASE_CONFIG_FILE=/Users/saurabharch/dev/rollout/rollout-server/.firebasekey.json -e DATABASE_URI=mongodb://localhost/test


sudo docker run --env FIREBASE_CONFIG_FILE="/Users/saurabharch/dev/rollout/rollout-server/.firebasekey.json" rollout-server



sudo docker run --env-file FIREBASE_CONFIG_FILE="/home/saurabharch/dev/rollout-server/.firebasekey.json" rollout-server


sudo docker run --env DATABASE_URI="mongodb://10.108.109.1/test" --env-file ./.env.list --link my-mongo:mongo rollout-server


# Disable heroku cache

heroku config:set NODE_MODULES_CACHE=false -a rollout-server-pre
heroku config:set NODE_MODULES_CACHE=true -a rollout-server-pre


# Config set
https://stackoverflow.com/questions/35483721/failed-to-replace-env-in-config-using-bash-npm
npm config set '//registry.npmjs.org/:_authToken' "${NPM_TOKEN}"
npm publish


heroku config set "//registry.npmjs.org/:_authToken"=${NPM_TOKEN}  -a rollout-server-pre



# Enable enterprise module: (WIP)

npm run enable-ent


# Change Local dependencies 
https://github.com/npm/npm/blob/b706d637d5965dbf8f7ce07dc5c4bc80887f30d8/doc/files/package.json.md#local-paths


# Proxy Manager

[click for more](../clusters/proxy-manager/README.md)