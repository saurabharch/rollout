const path = require("path");
module.exports = {
  apps: [
    {
      name: "rollout-server",
      script: "server.js",

      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      // args: "one two",
      instances: 1,
      autorestart: true,
      watch: true,
      watch:
        process.env.NODE_ENV !== "production"
          ? path.resolve(__dirname, "./")
          : false,
      exec_mode: "cluster",
      max_memory_restart: "1G",
      instances: 2,
      env_production: {
        NODE_ENV: "production"
      }
    }
  ],
  deploy: {
    production: {
      user: "saurabh",
      host: "rollout.com",
      repo: "https://github.com/Kappy-Technologies-LLP/rollout.git",
      ref: "origin/master",
      path: "/home/saurabh/rollout",
      "post-deploy":
        "npm install && pm2 startOrRestart ecosystem.json --env production"
    },
    development: {
      user: "saurabh",
      host: "http://localhost:5000",
      repo: "https://github.com/Kappy-Technologies-LLP/rollout.git",
      ref: "origin/master",
      path: ".",
      "post-deploy":
        "npm install && pm2 startOrRestart ecosystem.json --env production"
    }
  }
  // deploy: {
  //   production: {
  //     user: "ubuntu",
  //     host: "212.83.163.1",
  //     // host: "ec2-52-209-166-225.eu-west-1.compute.amazonaws.com",
  //     // key: "~/.ssh/rollout.pem",
  //     ref: "origin/master",
  //     repo: "git@github.com:Kappy-Technologies-LLP/rollout.git",
  //     path: "/var/www/production",
  //     "post-deploy":
  //       "npm install && pm2 reload ecosystem.config.js --env production"
  //     // "post-deploy": "npm install && pm2 startOrRestart ecosystem.config.js"
  //   }
  // }
};
