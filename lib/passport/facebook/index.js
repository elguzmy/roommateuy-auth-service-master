const FacebookTokenStrategy = require('passport-facebook-token');

const User = require('../../../models/user');
const config = require('../../config');

const getFacebookPassport = passport => {
    const opts = {
        clientID: config.fb.appId,
        clientSecret: config.fb.secretToken,
    };

    passport.use('facebook-token', new FacebookTokenStrategy(opts, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await User.findOne({ 'facebookProvider.id': profile.id });

            if (user) {
                const { user_id, method } = user;

                return done(null, { user_id, method });
            }

            const newUser = new User({
                email: profile.emails[0].value,
                method: 'facebook',
                facebookProvider: {
                    id: profile.id,
                    access_token: accessToken,
                }
            });

            await newUser.save();

            done(null, { user_id: newUser.user_id, method: newUser.method });
        } catch (err) {
            done(err, false, err.message);
        }
    }));
};

module.exports = {
    getFacebookPassport,
};
