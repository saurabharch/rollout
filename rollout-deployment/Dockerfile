FROM node:18-alpine
LABEL maintainer="rollout"
MAINTAINER Saurabh Kashyap <saurabhkashyap0001@gmail.com>
# Add hello scripts
ADD installer /installer
RUN chmod +x /installer
RUN /installer
RUN apk add py-pip python-dev 
RUN apk update \
    && apk upgrade \
    && apk --no-cache add --update tcl apache2 ca-certificates

# # # Install necessary tools
RUN apk add -y nano wget dialog net-tools

# # Download and Install Nginx
# RUN apt-get install -y nginx  
RUN sudo apt-get install -y nginx
RUN sudo add-apt-repository ppa:certbot/certbot

RUN sudo apt-get update

RUN sudo apt install python-certbot-nginx

RUN sudo certbot --nginx -d serversfault.com -d www.serversfault.com

#----------------------- Alternate ------------------------
#sudo certbot certonly --standalone -d serversfault.com www.serversfault.com
# ----------------------------------------------------------
RUN sudo ufw default deny incoming
RUN sudo ufw default deny incoming
RUN sudo ufw default allow outgoing
RUN sudo ufw allow ssh
RUN sudo ufw allow 'Nginx Full'
RUN sudo ufw delete allow 'Nginx HTTP'
RUN sudo ufw allow enable
RUN sudo ufw allow http
RUN sudo ufw allow https
RUN sudo ufw status
RUN sudo ufw status
RUN sudo ufw allow 443/tcp
RUN sudo systemctl status nginx

# # Remove the default Nginx configuration file
RUN rm -v /etc/nginx/nginx.conf

# # Copy a configuration file from the current directory
ADD ./nginx/nginx.conf ./etc/nginx/
# # Append "daemon off;" to the configuration file
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
RUN sudo ln -s sites-available/rollout sites-available/rollout
# # Expose ports

# Set the default command to execute when creating a new container
# ENTRYPOINT [ "../rollout-deployment/mongo-run.sh" ]
# Make docker-compose wait for container dependencies be ready
# Solution 1: use dockerize tool -----------------------------
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Solution 2: use docker-compose-wait tool -------------------
ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait
RUN apk update \
    && apk upgrade

RUN apt install -y git

WORKDIR ./app
# # Copy the package.json to workdir
COPY ../package*.json ./
ENV TERM=linux
ARG NODE_ENV=development
ARG REST_URL=http://localhost:5500
ENV NODE_ENV $NODE_ENV
ENV REST_URL $REST_URL
# Run npm install - install the npm dependencies
RUN npm install
COPY ./nginx/nginx.conf ./etc/nginx/nginx.conf
# RUN mkdir -p /data/db && \
#     chown -R mongodb /data/db

# VOLUME /data/db
# EXPOSE 27017

# COPY mongo-run.sh /root
# ENTRYPOINT [ "/root/mongo-run.sh" ]


# Copy application source
COPY ../ ./app

# Copy .env.docker to workdir/.env - use the docker env
COPY ../docker.env ./docker.env

# Expose application ports - (4300 - for API and 4301 - for front end)
EXPOSE 5501 55000 80 443



RUN npm install pm2@latest -g
RUN npm install
# # Generate build
# RUN npm run build
# CMD [ "pm2-runtime", "npm", "--", "start" ]
ENTRYPOINT [ "./deploy-pm2.sh" ]
USER node
CMD [ "sudo pm2 start npm run start:dev --name server-1 -- --name server-1 --port 5500 --watch", "sudo pm2 save" , "sudo pm2 startup" , "sudo service nginx restart", "sudo /etc/init.d/nginx reload"]
