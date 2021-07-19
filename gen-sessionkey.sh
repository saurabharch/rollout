#!/bin/bash

function generatePassword() {
    openssl rand -hex 16
}

SESSION_SECRET=$(generatePassword)
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=25
MAIL_USER=MLdctucuQ_6zUzymk0n4Hg
MAIL_PASS=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
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

sed -i.bak \
    -e "s#SESSION_SECRET=.*#SESSION_SECRET=${SESSION_SECRET}#g" \
    -e "s#MAIL_HOST=.*#MAIL_HOST=${MAIL_HOST}#g" \
    -e "s#MAIL_PORT=.*#MAIL_PORT=${MAIL_PORT}#g" \
    -e "s#MAIL_USER=.*#MAIL_USER=${MAIL_USER}#g" \
    -e "s#MAIL_PASS=.*#MAIL_PASS=${MAIL_PASS}#g" \
    "$(dirname "$0")/.env"
