const { ExtractJwt, Strategy } = require('passport-jwt');
const { readFileSync } = require('fs');
const path = require('path');

const User = require('../../../models/user');
const config = require('../../config');

const publicCert = readFileSync(path.resolve(__dirname, '../../../lib/cert/pubkey.pem'), 'utf8');

const getJWTPassport = passport => {
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: publicCert || config.jwt.secret,
        issuer: config.jwt.options.issuer,
    };

    passport.use(new Strategy(opts, async (payload, done) => {
        try {
            const user = await User.findOne({ user_id: payload.user_id }).select('user_id');

            if (!user) {
                return done(null, false);
            }

            const { user_id } = user;

            done(null, { user_id });
        } catch (err) {
            done(err, false);
        }
    }));
};

module.exports = {
    getJWTPassport,
};
