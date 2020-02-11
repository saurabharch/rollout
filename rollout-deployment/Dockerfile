FROM node:alpine
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

# # Install necessary tools
# RUN apt-get install -y nano wget dialog net-tools

# # Download and Install Nginx
# RUN apt-get install -y nginx  

# # Remove the default Nginx configuration file
# RUN rm -v /etc/nginx/nginx.conf

# # Copy a configuration file from the current directory
# ADD nginx.conf /etc/nginx/

# # Append "daemon off;" to the configuration file
# RUN echo "daemon off;" >> /etc/nginx/nginx.conf

# # Expose ports
# EXPOSE 80

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


WORKDIR ./app
# # Copy the package.json to workdir
# COPY package.json ./
ENV TERM=linux
ARG NODE_ENV=production
ARG REST_URL=http://localhost:3000
ENV NODE_ENV $NODE_ENV
ENV REST_URL $REST_URL
# Run npm install - install the npm dependencies
RUN npm install

# RUN mkdir -p /data/db && \
#     chown -R mongodb /data/db

# VOLUME /data/db
# EXPOSE 27017

# COPY mongo-run.sh /root
# ENTRYPOINT [ "/root/mongo-run.sh" ]


# Copy application source
COPY . ./app

# Copy .env.docker to workdir/.env - use the docker env
# COPY ./docker.env ./docker.env

# Expose application ports - (4300 - for API and 4301 - for front end)
EXPOSE 3000 3001



RUN npm install pm2@latest -g
RUN npm install
# # Generate build
# RUN npm run build
CMD [ "pm2-runtime", "npm", "--", "start" ]
USER node