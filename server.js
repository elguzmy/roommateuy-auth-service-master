if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}

require('./lib/db');

const server = require('./app');
const logger = require('./lib/utils/logger');
const config = require('./lib/config');

server.listen(config.PORT, () => logger.log('info', `${config.serviceName} service running on ${config.PORT}`));
