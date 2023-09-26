const config = require('./global');

config.logger.level = 'silly';
config.debug = true;

config.db.mongo.getURI = () => `mongodb://localhost:27017/${config.db.mongo.dbName}`;

module.exports = config;
