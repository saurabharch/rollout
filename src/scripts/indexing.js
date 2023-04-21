// const dotenv = require('dotenv');

// dotenv.config();
const { getConfig } = require('../lib/config');
const { initDb } = require('../lib/db');

const Promise = require('bluebird');

// get config
const config = getConfig();
// const mongodb = require('../storages/mongodb');

const ElasticSearchLib = require('../lib/elastic-search-lib');
const { async } = require('q');

async function start() {
initDb(config.databaseConnectionString, (err, db) => {
    Promise.all([
      ElasticSearchLib.dropUserIndex()
    ])
    .then(() => {
        Promise.all([
            ElasticSearchLib.createUserIndex()
        ])
        .then(async() => {
            const user = await db.users.find({}).toArray();
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
           
            console.log('ElasticSearch data Indexing complete');
            process.exit();
        })
        .catch((err) => {
            console.log('Error inserting ElasticSearch Indexing data', err);
            process.exit(2);
        });
    })
    .catch((err) => {
        console.log('Error removing existing ElasticSearch data', err);
        process.exit(2);
    });
});
}
// async function start() {
//   await ElasticSearchLib.dropUserIndex();
//   await ElasticSearchLib.createUserIndex();

//   const user = await User.find();
//   await Promise.map(users, (user) => {
//     const { _id, username, email,active,image } = user;
//     return ElasticSearchLib.indexProduct({
//       id: _id.toString(),
//       username,
//       email,
//       active,
//       image
//     });
//   }, { concurrency: 10 });
// }

setTimeout(() => {
  start()
    .then(() => process.exit())
    // eslint-disable-next-line no-console
    .catch((error) => console.error(error));
}, 1000);