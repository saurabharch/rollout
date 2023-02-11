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
REDIS_DATABASE=
REDIS_PASSWORD=
REDIS_URL=redis://127.0.0.1:6379
REDIS_TLS=false #default it is false
MINIO_ENDPOINT=127.0.0.1
MINIO_PORT=9000
MINIO_SSL_STATUS=false
MINIO_ACCESS_KEY=oSLahrIRQPCTsfOx6-RrxQ
MINIO_SECRET_KEY=zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG
BULLMQ=true
# Global properties:
# See https://developer.rollout.com/ for more information regarding these properties.

#PORT=5500
#Default is 5500

#LOG_LEVEL=debug

#GLOBAL_SECRET=YOUR_JWT_SECRET
#Default is nodeauthsecret

#ADMIN_EMAIL=your_admin_email
#Default is: admin@rollout.com

#ADMIN_PASSWORD=your_password;
#Default is: adminadmin

#SUPER_PASSWORD=ROLLOUT_SUPER_ADMIN_PASSWORD 
#Default is: nodeauthsecret

#CREATE_INITIAL_DATA=false

## Database

#MONGODB_URI=YOUR_MONGO_URI
#Default is : mongodb://localhost/web-push

#MONGODB_LOGS_URI=YOUR_MONGO_URI_FOR_LOGGING
#Default is : mongodb://localhost/web-logs

## Email

#EMAIL_ENABLED=true
#Default is false
ROUTELOGGER_ENABLED=true
TASK_SCHEDULER_ENABLED=true
#EMAIL_BASEURL=https://YOOURDOMAIN.com/dashboard
#Default is : https://console.rollout.com/v2/dashboard
DOMAIN=localhost #default SERVER DOMAIN ADDRESS NAME is localhost change it by your own FQCDN
#EMAIL_HOST=YOUR_EMAIL_HOST
#EMAIL_USERNAME=YOUR_EMAIL_USERNAME
#EMAIL_SECURE=true #defaults to 587 if is secure is false or 465 if true
#EMAIL_PORT=25
#EMAIL_PASSWORD=YOUR_SMTP_PASSWORD
#EMAIL_FROM_ADDRESS=FROM_ADDRESS


#For multiline support see here:
#dotenv -> https://github.com/bkeepers/dotenv#multi-line-values

#EMAIL_ASSIGN_REQUEST_HTML_TEMPLATE=
#EMAIL_POOLED_REQUEST_HTML_TEMPLATE=
#EMAIL_RESET_PASSWORD_HTML_TEMPLATE=
#EMAIL_PASSWORD_CHANGED_HTML_TEMPLATE=
#EMAIL_EXUSER_INVITED_HTML_TEMPLATE=
#EMAIL_NEWUSER_INVITED_HTML_TEMPLATE=
#EMAIL_VERIFY_HTML_TEMPLATE=
#EMAIL_SEND_TRANSCRIPT_HTML_TEMPLATE=


#DISABLE_TRANSCRIPT_VIEW_PAGE=true
#Disable view transcript messages using request_id field. Pay attention to security for this feature. Default is false

# Chat channel. ATTENTION!!!! THESE PROPERTIES MUST BE CONFIGURED.

# important
#FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\***************\n-----END PRIVATE KEY-----\n
#FIREBASE_CLIENT_EMAIL=firebase-adminsdk-******@************.iam.gserviceaccount.com
#FIREBASE_PROJECT_ID=CHANGEIT

# Chat Engine

CHAT_ENABLED=true

CHAT_ENGINE=mqtt
#CHAT_ENGINE=firebase

# Native Chat Engine
CHAT_URL=http://localhost:8004

# Firebase Chat Engine
#CHAT_URL=https://CHANGEIT.cloudfunctions.net

# optional properties
#CHAT_APPID=rolloutchat
#Default is rolloutchat

CHAT_JWT_SECRET=tokenKey
#Used by Native ChatEngine for generating JWT tokens

# Native Chat Engine
CHAT_ADMIN_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNDU2MTBkNy03MmYxLTQ5OWUtODQzMS0xMTNhZWJkOWVmOTgiLCJzdWIiOiIxMDAtQVBJQURNSU4iLCJzY29wZSI6WyJyYWJiaXRtcS5yZWFkOiovKi8qIiwicmFiYml0bXEud3JpdGU6Ki8qLyoiLCJyYWJiaXRtcS5jb25maWd1cmU6Ki8qLyoiXSwiY2xpZW50X2lkIjoiMTAwLUFQSUFETUlOIiwiY2lkIjoiMTAwLUFQSUFETUlOIiwiYXpwIjoiMTAwLUFQSUFETUlOIiwidXNlcl9pZCI6IjEwMC1BUElBRE1JTiIsImFwcF9pZCI6InRpbGVjaGF0IiwiaWF0IjoxNjE0OTQzNDkyLCJleHAiOjE5MjU5ODM0OTIsImF1ZCI6WyJyYWJiaXRtcSIsIjEwMC1BUElBRE1JTiJdLCJraWQiOiJ0aWxlZGVzay1rZXkiLCJ0aWxlZGVza19hcGlfcm9sZXMiOiJhZG1pbiJ9.KptGMsTKjd3wUiiP1GGSTYqW1XXK1vjSRJnetC3wjxU
SYNC_ROLLOUT_GROUPS=false
SYNC_JOIN_LEAVE_GROUP_EVENT=true
# Firebase Chat Engine
#CHAT_ADMIN_TOKEN=chat-secret-orgAa,
#Default for firebase engine is: chat-secret-orgAa,




# optional properties for rollout-server docker installation but required for docker-compose used by clients (dashboard, ionic, widget)
# important
#FIREBASE_APIKEY=CHANGEIT
#FIREBASE_AUTHDOMAIN=CHANGEIT.firebaseapp.com
#FIREBASE_DATABASEURL=https://CHANGEIT.firebaseio.com
#FIREBASE_STORAGEBUCKET=CHANGEIT.appspot.com
#FIREBASE_MESSAGINGSENDERID=********
#FIREBASE_APP_ID=CHANGEIT





#WS_URL=ws://localhost:3000/
# WebSocket endpoint.

## Widget settings

# important
WIDGET_LOCATION=http://localhost:4200/launch.js
#Default is http://localhost:4200/

WIDGET_TEST_LOCATION=http://localhost:4200/assets/test_widget_page/index.html

# RASA SERVER CONFIG
# in-server RASA PROXY Config
# API_ENDPOINT=https://api.rollout.com/v2
# RASAserver=http://34.254.234.17

#WS_HISTORY_REQUESTS_LIMIT=50
#Default is 100


#WS_SERVER_PATH=/v2/ws
#Default is /

#WEBHOOK_ORIGIN=https://api.YOURDOMAIN.com
#Default is http://localhost:5500

# Enterprise modules. For enterprise modules configuration please refer to https://docs.rollout.com/knowledge-base/install-rollout-enterprise-with-kubernetes/

#Enable and configure these properties if you are using npm (or Heroku) installation. This is not required if you are using Docker Enterprise images. 
#ENABLE_ENTERPRISE_MODULE=true 

#NPM_TOKEN=XXXX
#Enable enterprise module with npm private token


sed -i.bak \
    -e "s#PORT=.*#PORT=${PORT}#g" \
    -e "s#GLOBAL_SECRET=.*#GLOBAL_SECRET=${GLOBAL_SECRET}#g" \
    -e "s#ADMIN_EMAIL=.*#ADMIN_EMAIL=${ADMIN_EMAIL}#g" \
    -e "s#SUPER_PASSWORD=.*#SUPER_PASSWORD=${SUPER_PASSWORD}#g" \
    -e "s#SESSION_SECRET=.*#SESSION_SECRET=${SESSION_SECRET}#g" \
    -e "s#CREATE_INITIAL_DATA=.*#CREATE_INITIAL_DATA=${CREATE_INITIAL_DATA}#g" \
    -e "s#MONGO_USERNAME=.*#MONGO_USERNAME=${MONGO_USERNAME}#g" \
    -e "s#MONGO_PASSWORD=.*#MONGO_PASSWORD=${MONGO_PASSWORD}#g" \
    -e "s#MONGO_HOST=.*#MONGO_HOST=${MONGO_HOST}#g" \
    -e "s#MONGO_PORT=.*#MONGO_PORT=${MONGO_PORT}#g" \
    -e "s#MONGO_DATABASE=.*#MONGO_DATABASE=${MONGO_DATABASE}#g" \
    -e "s#MONGODB_URI=.*#MONGODB_URI=${MONGODB_URI}#g" \
    -e "s#MAIL_HOST=.*#MAIL_HOST=${MAIL_HOST}#g" \
    -e "s#MAIL_PORT=.*#MAIL_PORT=${MAIL_PORT}#g" \
    -e "s#MAIL_USER=.*#MAIL_USER=${MAIL_USER}#g" \
    -e "s#MAIL_PASS=.*#MAIL_PASS=${MAIL_PASS}#g" \
    -e "s#EMAIL_BASEURL=.*#EMAIL_BASEURL=${EMAIL_BASEURL}#g" \
    -e "s#EMAIL_ENABLED=.*#EMAIL_ENABLED=${EMAIL_ENABLED}#g" \
    -e "s#EMAIL_HOST=.*#EMAIL_HOST=${EMAIL_HOST}#g" \
    -e "s#EMAIL_USERNAME=.*#EMAIL_USERNAME=${EMAIL_USERNAME}#g" \
    -e "s#EMAIL_SECURE=.*#EMAIL_SECURE=${EMAIL_SECURE}#g" \
    -e "s#EMAIL_PORT=.*#EMAIL_PORT=${EMAIL_PORT}#g" \
    -e "s#EMAIL_PASSWORD=.*#EMAIL_PASSWORD=${EMAIL_PASSWORD}#g" \
    -e "s#EMAIL_FROM_ADDRESS=.*#EMAIL_FROM_ADDRESS=${EMAIL_FROM_ADDRESS}#g" \
    -e "s#EMAIL_ASSIGN_REQUEST_HTML_TEMPLATE=.*#EMAIL_ASSIGN_REQUEST_HTML_TEMPLATE=${EMAIL_ASSIGN_REQUEST_HTML_TEMPLATE}#g" \
    -e "s#EMAIL_POOLED_REQUEST_HTML_TEMPLATE=.*#EMAIL_POOLED_REQUEST_HTML_TEMPLATE=${EMAIL_POOLED_REQUEST_HTML_TEMPLATE}#g" \
    -e "s#EMAIL_RESET_PASSWORD_HTML_TEMPLATE=.*#EMAIL_RESET_PASSWORD_HTML_TEMPLATE=${EMAIL_RESET_PASSWORD_HTML_TEMPLATE}#g" \
    -e "s#EMAIL_PASSWORD_CHANGED_HTML_TEMPLATE=.*#EMAIL_PASSWORD_CHANGED_HTML_TEMPLATE=${EMAIL_PASSWORD_CHANGED_HTML_TEMPLATE}#g" \
    -e "s#EMAIL_EXUSER_INVITED_HTML_TEMPLATE=.*#EMAIL_EXUSER_INVITED_HTML_TEMPLATE=${EMAIL_EXUSER_INVITED_HTML_TEMPLATE}#g" \
    -e "s#EMAIL_NEWUSER_INVITED_HTML_TEMPLATE=.*#EMAIL_NEWUSER_INVITED_HTML_TEMPLATE=${EMAIL_NEWUSER_INVITED_HTML_TEMPLATE}#g" \
    -e "s#EMAIL_VERIFY_HTML_TEMPLATE=.*#EMAIL_VERIFY_HTML_TEMPLATE=${EMAIL_VERIFY_HTML_TEMPLATE}#g" \
    -e "s#EMAIL_SEND_TRANSCRIPT_HTML_TEMPLATE=.*#EMAIL_SEND_TRANSCRIPT_HTML_TEMPLATE=${EMAIL_SEND_TRANSCRIPT_HTML_TEMPLATE}#g" \
    -e "s#REDIS_HOST=.*#REDIS_HOST=${REDIS_HOST}#g" \
    -e "s#REDIS_PORT=.*#REDIS_PORT=${REDIS_PORT}#g" \
    -e "s#REDIS_DATABASE=.*#REDIS_DATABASE=${REDIS_DATABASE}#g" \
    -e "s#REDIS_PASSWORD=.*#REDIS_PASSWORD=${REDIS_PASSWORD}#g" \
    -e "s#REDIS_TLS=.*#REDIS_TLS=${REDIS_TLS}#g" \
    -e "s#MINIO_ENDPOINT=.*#MINIO_ENDPOINT=${MINIO_ENDPOINT}#g" \
    -e "s#MINIO_PORT=.*#MINIO_PORT=${MINIO_PORT}#g" \
    -e "s#MINIO_SSL_STATUS=.*#MINIO_SSL_STATUS=${MINIO_SSL_STATUS}#g" \
    -e "s#MINIO_ACCESS_KEY=.*#MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY}#g" \
    -e "s#MINIO_SECRET_KEY=.*#MINIO_SECRET_KEY=${MINIO_SECRET_KEY}#g" \
    -e "s#BULLMQ=.*#BULLMQ=${BULLMQ}#g" \
    -e "s#LOG_LEVEL=.*#LOG_LEVEL=${LOG_LEVEL}#g" \
    -e "s#MONGODB_LOGS_URI=.*#MONGODB_LOGS_URI=${MONGODB_LOGS_URI}#g" \
    -e "s#ROUTELOGGER_ENABLED=.*#ROUTELOGGER_ENABLED=${ROUTELOGGER_ENABLED}#g" \
    -e "s#TASK_SCHEDULER_ENABLED=.*#TASK_SCHEDULER_ENABLED=${TASK_SCHEDULER_ENABLED}#g" \
    -e "s#DOMAIN=.*#DOMAIN=${DOMAIN}#g" \
    -e "s#DISABLE_TRANSCRIPT_VIEW_PAGE=.*#DISABLE_TRANSCRIPT_VIEW_PAGE=${DISABLE_TRANSCRIPT_VIEW_PAGE}#g" \
    -e "s#FIREBASE_PRIVATE_KEY=.*#FIREBASE_PRIVATE_KEY=${FIREBASE_PRIVATE_KEY}#g" \
    -e "s#FIREBASE_CLIENT_EMAIL=.*#FIREBASE_CLIENT_EMAIL=${FIREBASE_CLIENT_EMAIL}#g" \
    -e "s#FIREBASE_PROJECT_ID=.*#FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}#g" \
    -e "s#CHAT_ENABLED=.*#CHAT_ENABLED=${CHAT_ENABLED}#g" \
    -e "s#CHAT_ENGINE=.*#CHAT_ENGINE=${CHAT_ENGINE}#g" \
    -e "s#CHAT_URL=.*#CHAT_URL=${CHAT_URL}#g" \
    -e "s#CHAT_APPID=.*#CHAT_APPID=${CHAT_APPID}#g" \
    -e "s#CHAT_JWT_SECRET=.*#CHAT_JWT_SECRET=${CHAT_JWT_SECRET}#g" \
    -e "s#CHAT_ADMIN_TOKEN=.*#CHAT_ADMIN_TOKEN=${CHAT_ADMIN_TOKEN}#g" \
    -e "s#SYNC_ROLLOUT_GROUPS=.*#SYNC_ROLLOUT_GROUPS=${SYNC_ROLLOUT_GROUPS}#g" \
    -e "s#SYNC_JOIN_LEAVE_GROUP_EVENT=.*#SYNC_JOIN_LEAVE_GROUP_EVENT=${SYNC_JOIN_LEAVE_GROUP_EVENT}#g" \
    -e "s#FIREBASE_APIKEY=.*#FIREBASE_APIKEY=${FIREBASE_APIKEY}#g" \
    -e "s#FIREBASE_AUTHDOMAIN=.*#FIREBASE_AUTHDOMAIN=${FIREBASE_AUTHDOMAIN}#g" \
    -e "s#FIREBASE_STORAGEBUCKET=.*#FIREBASE_STORAGEBUCKET=${FIREBASE_STORAGEBUCKET}#g" \
    -e "s#FIREBASE_DATABASEURL=.*#FIREBASE_DATABASEURL=${FIREBASE_DATABASEURL}#g" \
    -e "s#FIREBASE_MESSAGINGSENDERID=.*#FIREBASE_MESSAGINGSENDERID=${FIREBASE_MESSAGINGSENDERID}#g" \
    -e "s#FIREBASE_APP_ID=.*#FIREBASE_APP_ID=${FIREBASE_APP_ID}#g" \
    -e "s#WS_URL=.*#WS_URL=${WS_URL}#g" \
    -e "s#WS_HISTORY_REQUESTS_LIMIT=.*#WS_HISTORY_REQUESTS_LIMIT=${WS_HISTORY_REQUESTS_LIMIT}#g" \
    -e "s#WIDGET_LOCATION=.*#WIDGET_LOCATION=${WIDGET_LOCATION}#g" \
    -e "s#WIDGET_TEST_LOCATION=.*#WIDGET_TEST_LOCATION=${WIDGET_TEST_LOCATION}#g" \
    -e "s#WEBHOOK_ORIGIN=.*#WEBHOOK_ORIGIN=${WEBHOOK_ORIGIN}#g" \
    -e "s#API_ENDPOINT=.*#API_ENDPOINT=${API_ENDPOINT}#g" \
    -e "s#RASAserver=.*#RASAserver=${RASAserver}#g" \
    -e "s#ENABLE_ENTERPRISE_MODULE=.*#ENABLE_ENTERPRISE_MODULE=${ENABLE_ENTERPRISE_MODULE}#g" \
    -e "s#NPM_TOKEN=.*#NPM_TOKEN=${NPM_TOKEN}#g" \
    "$(dirname "$0")/.env"
