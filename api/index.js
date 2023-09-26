const apiRoutes = require('express').Router();

const authRouter = require('./auth');
const healthRouter = require('./health');

const config = require('../lib/config');

apiRoutes.use(`/${config.authAPI.url}`, authRouter);
apiRoutes.use('/authHealth', healthRouter);

module.exports = apiRoutes;