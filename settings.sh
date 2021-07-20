#!/usr/bin/env bash
clear
printf "This is information provided by mysystem.sh.  Program starts now.\n"

printf "Hello, $USER.\n\n"

printf "Today's date is `date`, this is week `date +"%V"`.\n\n"

printf "These users are currently connected:\n"
w | cut -d " " -f 1 - | grep -v USER | sort -u
printf "\n"

printf "This is `uname -s` running on a `uname -m` processor.\n\n"

printf "This is the uptime information:\n"
uptime
printf "\n"

printf "That's all folks!\n"

function generatePassword() {
    openssl rand -hex 16
}

function vapidKeys(){

    exec ./node_modules/.bin/web-push generate-vapid-keys
    echo
}
echo $(vapidKeys)
SESSION_SECRET=$(generatePassword)
MONGO_USERNAME=
MONGO_PASSWORD=
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DATABASE=web-push
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=25
MAIL_USER=MLdctucuQ_6zUzymk0n4Hg
MAIL_PASS=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
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

sed -i.bak \
    -e "s#SESSION_SECRET=.*#SESSION_SECRET=${SESSION_SECRET}#g" \
    -e "s#MONGO_USERNAME=.*#MONGO_USERNAME=${MONGO_USERNAME}#g" \
    -e "s#MONGO_PASSWORD=.*#MONGO_PASSWORD=${MONGO_PASSWORD}#g" \
    -e "s#MONGO_HOST=.*#MONGO_HOST=${MONGO_HOST}#g" \
    -e "s#MONGO_PORT=.*#MONGO_PORT=${MONGO_PORT}#g" \
    -e "s#MONGO_DATABASE=.*#MONGO_DATABASE=${MONGO_DATABASE}#g" \
    -e "s#MAIL_HOST=.*#MAIL_HOST=${MAIL_HOST}#g" \
    -e "s#MAIL_PORT=.*#MAIL_PORT=${MAIL_PORT}#g" \
    -e "s#MAIL_USER=.*#MAIL_USER=${MAIL_USER}#g" \
    -e "s#MAIL_PASS=.*#MAIL_PASS=${MAIL_PASS}#g" \
    "$(dirname "$0")/.env"
