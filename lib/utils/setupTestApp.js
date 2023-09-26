const sinon = require('sinon'); // eslint-disable-line import/no-extraneous-dependencies

const app = require('../../app');

const setupTestApp = ({ route, params = [] }) => {
    const errorSpy = sinon.spy();

    params.forEach(({ name, middleware }) => {
        app.param(name, middleware);
    });

    app[route.method.toLowerCase()](route.path, route.middleware);

    app.use((err, req, res, next) => {
        errorSpy(err, req, res, next);
        res.sendStatus(418);
    });

    return [app, errorSpy];
};

module.exports = setupTestApp;
