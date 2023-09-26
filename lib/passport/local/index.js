const { Strategy } = require('passport-local');

const User = require('../../../models/user');
const config = require('../../config');
const { error } = require('../../errorManagement');

const opts = {
    usernameField: 'email',
    passwordField: 'password',
};

const getLocalPassport = passport => {
    passport.use(new Strategy(opts, async (email, password, done) => {
        try {
            const user = await User.findOne({ email }).select('user_id email local.password');

            if (!user) {
                return done(null, false);
            }

            const isValidPassword = await user.validatePassword(password);

            if (!isValidPassword) {
                return done(null, false);
            }

            const { user_id } = user;

            done(null, { user_id, });
        } catch (err) {
            done(err, false);
        }
    }));
};

module.exports = {
    getLocalPassport,
};