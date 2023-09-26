const NODE_ENV = (process.env.NODE_ENV || 'development').toLowerCase();
let config;

try {
    const target = `./env/${NODE_ENV}`;

    config = require(target); // eslint-disable-line
} catch (err) {
    console.log('CONFIG LOAD ERROR', err);
    try {
        config = require('./env/development'); // eslint-disable-line
    } catch (err2) {
        console.log('CONFIG DEFAULT ERROR', err2);
        config = {};
    }
}

module.exports = config;
