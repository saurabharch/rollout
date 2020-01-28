module.exports = {
  apps: [
    {
      name: "API",
      script: "server.js",

      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      args: "one two",
      instances: 1,
      autorestart: true,
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ],

  deploy: {
    production: {
      user: "ubuntu",
      host: "212.83.163.1",
      // host: "ec2-52-209-166-225.eu-west-1.compute.amazonaws.com",
      // key: "~/.ssh/rollout.pem",
      ref: "origin/master",
      repo: "git@github.com:Kappy-Technologies-LLP/rollout.git",
      path: "/var/www/production",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production"
      // "post-deploy": "npm install && pm2 startOrRestart ecosystem.config.js"
    }
  }
};
