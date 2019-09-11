const mongoose = require('mongoose');
const config = require('../config');
const debug = require('debug')('node-server:index');
const util = require('util');

Promise = require('bluebird');

mongoose.Promise = Promise;
mongoose.connect(config.mongo.host, {
    user: config.mongo.user,
    pass: config.mongo.pass,
    dbName: config.mongo.dbName,
    useNewUrlParser: true,
    useFindAndModify: false
});

mongoose.connection.on('error', (err) => {
    throw new Error(`unable to connect to database: ${config.mongo.host}`);
});

if (config.mongooseDebug) {
    mongoose.set('debug', (collectionName, method, query, doc) => {
      debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
    });
}

module.exports = mongoose.connection;
