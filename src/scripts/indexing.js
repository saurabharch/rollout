// const dotenv = require('dotenv');

// dotenv.config();

const Promise = require('bluebird');
const mongodb = require('../storages/mongodb');

mongodb.init();

const ElasticSearchLib = require('../libs/elastic-search-lib');
const User = require('../models/user');

async function start() {
  await ElasticSearchLib.dropUserIndex();
  await ElasticSearchLib.createUserIndex();

  const user = await User.find();
  await Promise.map(users, (user) => {
    const { _id, username, email,active,image } = user;
    return ElasticSearchLib.indexProduct({
      id: _id.toString(),
      username,
      email,
      active,
      image
    });
  }, { concurrency: 10 });
}

setTimeout(() => {
  start()
    .then(() => process.exit())
    // eslint-disable-next-line no-console
    .catch((error) => console.error(error));
}, 1000);