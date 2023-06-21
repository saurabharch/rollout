ARG NODE_VERSION=16.3.0
FROM node:${NODE_VERSION}-alpine
LABEL maintainer="rollout"
MAINTAINER Saurabh Kashyap <saurabhkashyap0001@gmail.com>
ARG NPM_TOKEN
ARG ROLLOUT_VERSION=1.0.01
ARG USERNAME="rollout"
RUN if [ -z "$ROLLOUT_VERSION" ] ; then echo "The ROLLOUT_VERSION argument is missing!" ; exit 1; fi


ENV NODE_ENV=production
ENV NPM_CONFIG_PREFIX=/rollout/.npm-global
ENV PATH=$PATH:/rollout/.npm-global/bin


RUN addgroup rollout && adduser -S -G rollout rollout

RUN apk add py-pip python3 openssl
RUN apk update \
    && apk upgrade \
    && apk --no-cache add --update tcl apache2 ca-certificates
#### => add this script to resolve that problem
RUN apk add --no-cache python2 g++ make shadow
RUN apk add --update-cache --repository http://dl-3.alpinelinux.org/alpine/edge/testing \
    vips-dev fftw-dev gcc g++ make libc6-compat 
RUN apk add --no-cache build-base libxi-dev mesa-dri-gallium glu glew pkgconf
# Add libvips
RUN apk add --upgrade --no-cache vips-dev build-base --repository https://alpine.global.ssl.fastly.net/alpine/v3.10/community/

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

RUN mkdir -p /rollout
WORKDIR /rollout

# RUN useradd -ms /bin/bash node
# RUN useradd rollout
# USER node
# RUN mkdir -p /home/node && chmod -R 755 rollout:rollout /home/node
RUN chmod -R 755 /rollout


# Copy only package.json and yarn.lock for cache
COPY package*.json /rollout/
COPY yarn*.lock /rollout/

RUN if [ "$NPM_TOKEN" ]; \
    then RUN COPY .npmrc_ .npmrc \
    else export SOMEVAR=world; \
    fi
# Install Dependncies
# RUN yarn install --production --ignore-optional --ignore-scripts --pure-lockfile --non-interactive --verbose

# Copy Files
# COPY . ./rollout
# COPY ./ ./rollout
COPY --chown=rollout:rollout --from= . /rollout/
COPY docker-entrypoint.sh /rollout/docker-entrypoint.sh
#COPY *.js /rollout/
#COPY *.env /rollout/

COPY .npmrc /usr/local/etc/.npmrc
RUN apk add --update nodejs-current npm

# Add hello scripts
ADD installer.sh /rollout/installer.sh
RUN chmod -R 755 /rollout/installer.sh
# ADD gen-cert.sh /rollout/gen-cert.sh
# RUN chmod +x /rollout/gen-cert.sh
# RUN mkdir -p /etc/ssl/certs/
# ENV HOSTNAME $HOSTNAME
# RUN /rollout/gen-cert.sh ${HOSTNAME} && rm -rf gen-cert.sh
RUN npm install -g node-gyp node-gyp-build
# RUN npm install --save nan
# RUN bash installer.sh




RUN set -eux; \
    apkArch="$(apk --print-arch)"; \
    case "$apkArch" in \
    'armv7') apk --no-cache add --virtual build-dependencies python3 build-base;; \
    esac && \
    #     npm install -g --omit=dev rollout@${ROLLOUT_VERSION} && \
    case "$apkArch" in \
    'armv7') apk del build-dependencies;; \
    esac
# find /usr/local/lib/node_modules/rollout -type f -name "*.ts" -o -name "*.js.map" -o -name "*.vue" | xargs rm && \
# rm -rf /root/.npm

# Set a custom user to not have rollout run as root

RUN apk --no-cache add su-exec

ENTRYPOINT ["tini", "--", "/rollout/docker-entrypoint.sh"]
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
RUN chmod -R 755 /wait
RUN apk update \
    && apk upgrade


# WORKDIR ./app
# # Copy the package.json to workdir
# COPY --chown=node:node package*.json ./

ENV TERM=linux
ARG REST_URL=http://localhost:5500
ENV NODE_ENV $NODE_ENV
ENV REST_URL $REST_URL

# RUN mkdir -p /data/db && \
#     chown -R mongodb /data/db

# VOLUME /data/db
# EXPOSE 27017

# COPY mongo-run.sh /root
# ENTRYPOINT [ "/root/mongo-run.sh" ]


# Copy .env.docker to workdir/.env - use the docker env
COPY env.example /rollout/docker.env
COPY process.yml /rollout/process.yml
# Copy application source
# COPY . ./app


# Expose application ports - (5500 - for API and 3000 - for front end)
EXPOSE 5500


RUN cd /rollout
# Run npm install - install the npm dependencies
# RUN npm install -g npm@7.15.1
# RUN npm install sharp --unsafe-perm
RUN npm install --unsafe-perm --loglevel=warn --production
RUN npm install --verbose sharp
RUN npx envinfo --binaries --languages --system --utilities
RUN rm -f /rollout/.npmrc
RUN npm install pm2@latest -g
RUN npm i -g cross-conf-env npm-run-all
# COPY --chown=rollout:rollout . .

# # Generate build
# RUN npm run build
# CMD [ "pm2-runtime", "npm", "--", "start" ]
# RUN npm run dev
# CMD ["npm run dev"]
CMD ["pm2-runtime", "process.yml"]
# CMD ["npm-run-all", "-p dev:*"]
# ENTRYPOINT [ "/rollout-deployment/deployment-pm2.sh" ]

# [Optional] Set the default user. Omit if you want to keep the default as root.
USER $USERNAME
