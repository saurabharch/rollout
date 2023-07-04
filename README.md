<p align="center">
  <a href="https://github.com/sponsors/saurabharch">
    <img src="./src/public/images/rollout.gif" width="180px">
  </a>
</p>

<p align="center">
    <img alt="Downloads" src="https://img.shields.io/docker/pulls/saurabharch/query-service?label=Downloads"> </a>
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/saurabharch/rollout"> </a>
    <img alt="Github License" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
    <a href="https://app.fossa.io/projects/git%2Bgithub.com%2Fsaurabharch%2Frollout?ref=badge_shield"><img alt="FOSSA Status" src="https://app.fossa.io/api/projects/git%2Bgithub.com%2Fsaurabharch%2Frollout.svg?type=shield"></a>

</p>


<h3 align="center">
  <a href="/docs"><b>Documentation</b></a> &bull;
  <a href="/README.zh-cn.md"><b>ReadMe in Chinese</b></a> &bull;
  <a href="/README.de-de.md"><b>ReadMe in German</b></a> &bull;
  <a href="/README.pt-br.md"><b>ReadMe in Portuguese</b></a> &bull;
  <a href="https://rolloutco.slack.com/archives/C0454S9BEVB"><b>Slack Community</b></a> &bull;
  <a href="https://twitter.com/rollout"><b>Twitter</b></a>
</h3>


##

## 💕 Sponsor Rollout

<a href="https://github.com/sponsors/saurabharch" target="_blank"><img src="/docs/sponsor-banner-readme.png?raw=true" alt="Sponsor Rollout" /></a>

> #  🍵 Buy a coffee for me

<a href='https://ko-fi.com/saurabharch' target='_blank'><img height='35' style='border:0px;height:46px;' src='https://az743702.vo.msecnd.net/cdn/kofi3.png?v=0' border='0' alt='Buy Me a Coffee at ko-fi.com' />
  
- `issuehunt: saurabharch`


## 💰Support

If you need paid support, consulting, or just want support/sponsor the ongoing development of this project, you can in the following ways:

|Description | Link |
|- |:-:|
| Buy a coffee for me | <a href="https://www.buymeacoffee.com/saurabharch" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
| Donate or Book 1 hour consult | [![Buy me a coffee][buymeacoffee-shield]][buymeacoffee]
| Per-minute consulting |   <a href="http://otechie.com/saurabharch"><img src="https://api.otechie.com/consultancy/saurabharch/badge.svg" alt="Consulting"></a>
| Hire me! | [![Consulting Request][consult-shield]][consult]
  
<br /><br />

# PushGeek Rollout Server


Rollout server is simple drip marketing automation tool which help to enggage more and more users with the website, which have features like

## 🚀 Technologies

- 🌐 Express — A web framework for Node.js
- 🎯Bull/BullMQ — Premium Queue package for handling distributed jobs
- 🚂 Handlebars - Html Engine
- 📧 Web-push, nodemailer
- 💽 MongoDB, Redis , Postgres, SQL-light
- 🔀 Nginx
- 🍔 Docker

<br /><br />
<img align="left" src="./docs/Features.svg" width="50px" />
## 💡 Feature List

- ✅ Push Message Broadcasting 👈
- ✅ DDoS Protection 👈
- ✅ Schedule Jobs Worker 👈
- ✅ Fast caches managed 👈
- ✅ OAuth 👈
- ✅ Login With multiple social platform 👈
- ✅ Cart Service 👈
- ✅ Product Display / Service Display 👈
- ✅ International Localization Features 👈
- ✅ Knowledge base 👈
- ✅ Advance Chat Widget Support Service 👈
- ✅ Text Analysis 👈
- ✅ nudity detection 👈
- ✨ more coming soon 👈

<br /><br />

<img align="left" src="./docs/Contributing.svg" width="50px" />

## 📖 Documentation

Documentation is available as a part of rollout preview: https://saurabharch.github.io/rollout/

<br /><br />

<img align="left" src="./docs/Philosophy.svg" width="50px" />

## Getting Started

[Click Here for Getting Start and Basic Setup](./docs/README.md)

<br /><br />

<img align="left" src="./docs/WhatsCool.svg" width="50px" />

## commands and API Integrations wiki 🧩🧪🆕

[Click](./docs/README.md) here for details page.


> ### Tip for Query Performance Testing

Add this

```bash
.explain("executionStats")
```

in query line example as below:

```bash
  db.collectionName.find().explain("executionStats").exec()
```

this command is used in windows🪟 OS close all http running service locally.
```shell
net stop http
```
<br></br>

## Deploy on Heroku 🛫

Deploy with button:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/saurabharch/rollout)

<br></br>

## Work in Action

<h1 align="center">
  <img alt="PushGeek" src="https://raw.githubusercontent.com/saurabharch/rollout/master/docs/screenshot.png?raw=true" width="380px" />
</h1>

<br /><br />

<img align="left" src="./docs/Contributors.svg" width="50px" />

## 📝Notes (Opinionated)

DO NOT do this for a real project of this size, this is to learn.
A Microservice architecture is for BIG projects with a lot of people.

People will tell you that you can do it at small scale and it is true
but you can also remove ants with a nuclear bomb.

Docker containers can be used without using Microservices, they are not the
same thing!

This is the most common way I see people build container based projects
but my personal favourite is using a queue for all container to container
communication.

<br></br>

## 🗒️Rule of thumb thoughts (Opinionated)

Docker containers = good for almost all project sizes
Microservices = good for big companies with a lot of code and people
Sweetspot = Monolith app and databases in containers

<br></br>
## 👨🏽‍💻🤓 Author

[Saurabh Kashyap](https://github.com/saurabharch)
  
[buymeacoffee-shield]: https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg
[buymeacoffee]: https://www.buymeacoffee.com/saurabharch
[consult-shield]: https://img.shields.io/badge/Require%20Paid%20Support%20or%20Consulting%3F-Click%20Here-blue?style=for-the-badge&logo=paypal
[consult]: mailto:saurabh@raindigi.com?subject=Rollout%20Consulting

<br></br>

<img align="left" src="./docs/Contributing.svg" width="50px" />

## Community

Join the [slack community](https://rolloutco.slack.com/archives/C0454S9BEVB) to know more about distributed Rollout and to connect with other users and contributors.

If you have any ideas, questions, or any feedback, please share on our [Github Discussions](https://github.com/saurabharch/rollout/discussions)

As always, thanks to our amazing contributors!

<a href="https://github.com/saurabharch/rollout/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=saurabharch/rollout" />
</a>
<br></br>

We ❤️ all contributions, big and small! Check out our [CONTRIBUTING](./CONTRIBUTING.md) guide to get started and let us know how we can help.

Don't want to miss anything? Give the project a ⭐ 🚀 

A HUGE THANK YOU to all our supporters!

[![Stargazers repo roster for @saurabharch/rollout](https://reporoster.com/stars/saurabharch/rollout)](https://github.com/saurabharch/rollout/stargazers)

## 📝 License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fsaurabharch%2Frollout.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fsaurabharch%2Frollout?ref=badge_large)


## 🪴 Project Activity
![Alt](https://repobeats.axiom.co/api/embed/40759511ce401954cc2cff694e540ff9db9cbbe4.svg "Repobeats analytics image")

#### 👋 [Official site](https://raindigi.com)  Pushgeek is made with ❤️ by © RainDigi IT Pvt. Ltd
  
![Visitor Count](https://profile-counter.glitch.me/{saurabharch}/count.svg)

<h3 align="center">Show some &nbsp;❤️&nbsp; by starring of the repository!</h3>
