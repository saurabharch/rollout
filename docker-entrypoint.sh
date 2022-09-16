#!/bin/sh

if [ -d /root/.rollout ] ; then
  chmod o+rx /root
  chown -R node /root/.rollout
  ln -s /root/.rollout /home/node/
fi

chown -R node /home/node

if [ "$#" -gt 0 ]; then
  # Got started with arguments
  exec su-exec node "$@"
else
  # Got started without arguments
  exec su-exec node rollout
fi