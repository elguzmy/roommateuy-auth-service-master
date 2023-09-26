const mongoose = require('mongoose');
const util = require('util');

const config = require('../config');
const logger = require('../utils/logger');

const mongoDbURI = config.db.mongo.getURI();

mongoose.Promise = global.Promise;

mongoose.connect(mongoDbURI, { useNewUrlParser: true })
    .then(() => logger.log('debug', 'DB connected successfully'))
    .catch(err => logger.log('error', `DB connection failed: ${util.inspect(err)}`));

module.exports = mongoose;
