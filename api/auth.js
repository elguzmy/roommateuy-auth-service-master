const authRouter = require('express').Router();
const passport = require('passport');

require('../lib/passport/local').getLocalPassport(passport);
require('../lib/passport/jwt').getJWTPassport(passport);
require('../lib/passport/facebook').getFacebookPassport(passport);

const authController = require('../controllers/authController');

const passportLocalAuth = passport.authenticate('local', { session: false });
const passportJWTAuth = passport.authenticate('jwt', { session: false });
const passportFacebookAuth = passport.authenticate('facebook-token', { session: false });

authRouter.get('/me', passportJWTAuth, authController.getCurrentUser);
authRouter.post('/register', authController.register);
authRouter.post('/login', passportLocalAuth, authController.login);
authRouter.post('/refreshToken', authController.refreshToken);
authRouter.post('/verifyToken', authController.verifyToken);
authRouter.get('/logout', passportJWTAuth, authController.logout);

// Social Login
authRouter.post('/facebook', passportFacebookAuth, authController.facebookOAuth);

module.exports = authRouter;
