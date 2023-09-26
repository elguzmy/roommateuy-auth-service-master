const TokenService = require('../services/TokenService');
const User = require('../models/user');

const { error, notFound, missingParam } = require('../lib/errorManagement');

const register = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        if (!email) {
            return next(missingParam({ param: 'email' }));
        }

        if (!password) {
            return next(missingParam({ param: 'password' }));
        }

        const foundUser = await User.findOne({ 'email': email });

        if (foundUser) {
            return res.status(409).json(error({ message: 'Email is already in use', errorCode: 'ERR_EMAIL_ALREADY_IN_USE', statusCode: 409 }));
        }


        const refreshToken = TokenService.createRefreshToken();
        const user = new User({
            method: 'local',
            email,
            local: {
                password,
            },
        });

        user.refresh_token.push(refreshToken);

        await user.save();

        const token = TokenService.sign({
            payload: {
                user_id: user.user_id,
            },
        });

        res.status(200).json({ user_id: user.user_id, token, refreshToken });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    const { user_id } =  req.user;
    const refresh_token = TokenService.createRefreshToken();

    try {
        await User.findOneAndUpdate({ user_id }, { $push: { refresh_token } });

        const token = TokenService.sign({ payload: { user_id } });

        res.status(200).json({ token, refresh_token, user_id });
    } catch (err) {
        next(err);
    }
};

const facebookOAuth = async (req, res, next) => {
    const { user_id } = req.user;

    if (!req.user) {
        return next(error({ message: 'Cannot login with Facebook', errorCode: 'ERR_AUTH_MISSING' }));
    }

    try {
        const refresh_token = TokenService.createRefreshToken();
        const token = TokenService.sign({ payload: { user_id, } });

        await User.findOneAndUpdate({ user_id }, { $push: { refresh_token } });

        res.status(200).json({ token, refresh_token, user_id });
    } catch (err) {
        next(err);
    }
};

const refreshToken = async (req, res, next) => {
    const { user_id, refresh_token } = req.body;

    if (!user_id) {
        return next(missingParam({ param: 'user_id' }));
    }

    if (!refresh_token) {
        return next(missingParam({ param: 'refresh_token' }));
    }

    try {
        const token = await TokenService.refreshToken({ user_id, refresh_token, });

        res.status(200).json({ token, });
    } catch (err) {
        next(err);
    }
};

const getCurrentUser = async (req, res, next) => {
    const { user_id } = req.user;

    if (!user_id) {
        return next(error({ message: 'Invalid user id' }));
    }

    const user = await User.findOne({ user_id }).select('-local.password -facebookProvider.access_token -refresh_token -_id -__v');

    if (!user) {
        return next(notFound());
    }

    res.status(200).json(user);
};

const verifyToken = async (req, res, next) => {
    const  { token } = req.body;

    if (!token) {
        return next(error({ message: 'JWT must be provided', errorCode: 'ERR_NO_TOKEN_PROVIDED', statusCode: 400 }));
    }

    try {
        const tokenPayload = await TokenService.verify({ token });

        res.status(200).json({ tokenPayload });
    } catch (err) {
        next(err);
    }
};

const logout = async (req, res, next) => {
    const { user_id } = req.user;

    try {
        await TokenService.destroyTokens({ user_id });

        res.sendStatus(200);
    } catch (e) {
        next(e)
    }
};

module.exports = {
    register,
    login,
    facebookOAuth,
    getCurrentUser,
    refreshToken,
    verifyToken,
    logout,
};
