const path = require("path");
module.exports = {
  apps: [
    {
      name: "rollout",
      script: "src/index.js",

      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      // args: "one two",
            cwd:"./",
      log_date_format:"YYYY-MM-DD HH:mm:ss",
      out_file:"./logs/out-0.log",
      error_file:"./logs/err-0.log",
      watch:true,
      exec_interpreter:"babel-node",
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
      user: "ubuntu",
      host: "ec2-3-6-90-204.ap-south-1.compute.amazonaws.com",
      key: "C://UsersAT/systems/Downloads/kp-push-2020.pem",
      repo: "https://github.com/saurabharch/rollout.git",
      ref: "origin/master",
      path: "/home/rollout/rollout",
      "post-deploy":
        "npm install && pm2 startOrRestart ecosystem.config.json --env production"
    },
    development: {
      user: "saurabh",
      host: "http://localhost:5500",
      repo: "https://github.com/saurabharch/rollout.git",
      ref: "origin/master",
      path: ".",
      "post-deploy":
        "npm install && pm2 startOrRestart ecosystem.config.json --env production"
    }
  }
  // deploy: {
  //   production: {
  //     user: "ubuntu",
  //     host: "212.83.163.1",
  //     // host: "ec2-3-6-90-204.ap-south-1.compute.amazonaws.com,
  // key: "~/.ssh/rollout.pem",
  //     ref: "origin/master",
  //     repo: "git@github.com:saurabharch/rollout.git",
  //     path: "/var/www/production",
  //     "post-deploy":
  //       "npm install && pm2 reload ecosystem.config.js --env production"
  //     // "post-deploy": "npm install && pm2 startOrRestart ecosystem.config.js"
  //   }
  // }
};
