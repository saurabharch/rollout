FROM node:alpine

WORKDIR ./app

EXPOSE 3000

RUN npm install pm2@latest -g
RUN npm install
CMD [ "pm2-runtime", "npm", "--", "start" ]