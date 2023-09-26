const jwt = require('jsonwebtoken');
const { readFileSync } = require('fs');
const path = require('path');
const uuid = require('uuid/v4');
const macAddress = require('node-macaddress');

const User = require('../models/user');
const { error } = require('../lib/errorManagement');
const config = require('../lib/config');

const privateCert = readFileSync(path.resolve(__dirname, '../lib/cert/privkey.pem'), 'utf8');
const publicCert = readFileSync(path.resolve(__dirname, '../lib/cert/pubkey.pem'), 'utf8');

class TokenService {
    static sign ({ payload, secret = privateCert, options = config.jwt.options }) {
        try {
            return jwt.sign(payload, secret, options);
        } catch (err) {
            throw error({ message: err.message, errorCode: err.name });
        }
    }

    static verify ({ token, secret = publicCert }) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    let errorCode, message;

                    if (err.name && err.name === 'TokenExpiredError') {
                        errorCode = 'ERR_TOKEN_EXPIRED';
                        message = 'JWT is expired';
                    } else {
                        errorCode = 'ERR_INVALID_TOKEN';
                        message = 'Invalid Token';
                    }

                    reject(error({ message, errorCode, statusCode: 400 }));
                } else {
                    resolve(decoded);
                }
            })
        })
    }

    // static getMACAddress () {
    //     return new Promise((resolve, reject) => {
    //        macAddress.one((err, mac) => {
    //            if (err) {
    //                reject(error({ message: err.message || 'Cannot get MAC address', statusCode: err.name || 'ERR_CANNOT_GET_MAC_ADDRESS' }));
    //            } else {
    //                resolve(mac);
    //            }
    //        })
    //     });
    // }

    static createRefreshToken () {
        return uuid();
    }

    static async refreshToken ({ refresh_token, user_id }) {
        try {
            const user = await User.findOne({ user_id, refresh_token });

            if (!user) {
                throw error({ message: 'Invalid refresh token', errorCode: 'ERR_INVALID_REFRESH_TOKEN', statusCode: 400 });
            }

            return this.sign({
                payload: {
                    user_id: user.user_id,
                },
            });
        } catch (err) {
            throw error({ message: err.message, errorCode: err.name || 'ERR_INVALID_REFRESH_TOKEN', statusCode: err.statusCode || 500 });
        }
    }

    static destroyTokens ({ user_id }) {
        try {
            return User.findOneAndUpdate({ user_id }, { $set: { refresh_token: [] } });
        } catch (e) {
            throw error({ message: err.message, errorCode: err.name || 'ERR_DESTROY_TOKENS', statusCode: err.statusCode || 500 });
        }
    }
}

module.exports = TokenService;