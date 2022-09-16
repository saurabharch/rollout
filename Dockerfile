ARG NODE_VERSION=16.3.0
FROM node:${NODE_VERSION}-alpine
LABEL maintainer="rollout"
MAINTAINER Saurabh Kashyap <saurabhkashyap0001@gmail.com>

ARG ROLLOUT_VERSION
RUN if [ -z "$ROLLOUT_VERSION" ] ; then echo "The ROLLOUT_VERSION argument is missing!" ; exit 1; fi

ENV NODE_ENV=production

WORKDIR /home/node
COPY . /home/node/
COPY .npmrc /usr/local/etc/npmrc
RUN apk add --update nodejs-current npm

# Add hello scripts
ADD installer.sh installer.sh
RUN chmod +x installer.sh
# ADD gen-cert.sh ./gen-cert.sh
# RUN chmod +x gen-cert.sh
# RUN mkdir -p /etc/ssl/certs/
# ENV HOSTNAME $HOSTNAME
# RUN ./gen-cert.sh ${HOSTNAME} && rm -rf gen-cert.sh
RUN npm install -g node-gyp
# RUN npm install --save nan
# RUN bash installer.sh
RUN apk add py-pip python3 openssl
RUN apk update \
    && apk upgrade \
    && apk --no-cache add --update tcl apache2 ca-certificates
#### => add this script to resolve that problem
RUN apk add --no-cache python2 g++ make

RUN \
    apk add --update graphicsmagick tini tzdata && \
    npm install -g npm@latest full-icu && \
    rm -rf /var/cache/apk/* /root/.npm /tmp/* && \
    # Install fonts
    apk --no-cache add --virtual fonts msttcorefonts-installer fontconfig && \
    update-ms-fonts && \
    fc-cache -f && \
    apk del fonts && \
    find  /usr/share/fonts/truetype/msttcorefonts/ -type l -exec unlink {} \; && \
    rm -rf /var/cache/apk/* /tmp/*
ENV NODE_ICU_DATA /usr/local/lib/node_modules/full-icu

RUN set -eux; \
    apkArch="$(apk --print-arch)"; \
    case "$apkArch" in \
    'armv7') apk --no-cache add --virtual build-dependencies python3 build-base;; \
    esac && \
    npm install -g --omit=dev rollout@${ROLLOUT_VERSION} && \
    case "$apkArch" in \
    'armv7') apk del build-dependencies;; \
    esac && \
    find /usr/local/lib/node_modules/rollout -type f -name "*.ts" -o -name "*.js.map" -o -name "*.vue" | xargs rm && \
    rm -rf /root/.npm

# Set a custom user to not have rollout run as root
USER root
WORKDIR /data
RUN apk --no-cache add su-exec
COPY docker-entrypoint.sh /docker-entrypoint.sh
ENTRYPOINT ["tini", "--", "/docker-entrypoint.sh"]
# # # Install necessary tools
#RUN apt-get install  -y nano wget dialog net-tools

# # Download and Install Nginx
#RUN apt-get install -y nginx  

# # Remove the default Nginx configuration file
#RUN rm -v /etc/nginx/nginx.conf

# # Copy a configuration file from the current directory
#COPY ./rollout-deployment/nginx/nginx.conf ./etc/nginx/nginx.conf
# ADD ./nginx/nginx.conf .conf/etc/nginx/
# # Append "daemon off;" to the configuration file
#RUN echo "daemon off;" >> /etc/nginx/nginx.conf

# # # Expose ports
# EXPOSE 80

# Set the default command to execute when creating a new container
# ENTRYPOINT [ "../rollout-deployment/mongo-run.sh" ]
# Make docker-compose wait for container dependencies be ready
# Solution 1: use dockerize tool -----------------------------
# ENV DOCKERIZE_VERSION v0.6.1
# RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
#     && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
#     && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Solution 2: use docker-compose-wait tool -------------------
ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait
RUN apk update \
    && apk upgrade


# WORKDIR ./app
# # Copy the package.json to workdir
COPY --chown=node:node package*.json ./

ENV TERM=linux
# ARG NODE_ENV=production
ARG REST_URL=http://localhost:5500
ENV NODE_ENV $NODE_ENV
ENV REST_URL $REST_URL
# Run npm install - install the npm dependencies
# RUN npm install -g npm@7.15.1
RUN npm install
# RUN mkdir -p /data/db && \
#     chown -R mongodb /data/db

# VOLUME /data/db
# EXPOSE 27017

# COPY mongo-run.sh /root
# ENTRYPOINT [ "/root/mongo-run.sh" ]


# Copy .env.docker to workdir/.env - use the docker env
COPY ./docker.env ./docker.env
COPY process.yml ./process.yml
# Copy application source
# COPY . ./app


# Expose application ports - (4300 - for API and 4301 - for front end)
EXPOSE 5501 5500




RUN npm install pm2@latest -g
RUN npm i -g cross-conf-env npm-run-all
COPY --chown=node:node . .
# # Generate build
# RUN npm run build
# CMD [ "pm2-runtime", "npm", "--", "start" ]
# RUN npm run dev
# CMD ["npm run dev"]
CMD ["pm2-runtime", "process.yml"]
# CMD ["npm-run-all", "-p dev:*"]
# ENTRYPOINT [ "./rollout-deployment/deployment-pm2.sh" ]
USER node