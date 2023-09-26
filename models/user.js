const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const { isEmail } = require('validator');

const { dbError } = require('../lib/errorManagement');
const config = require('../lib/config');

const { Schema } = mongoose;

const user_schema = new Schema({
    user_id:       {
                        type: String,
                        default: uuid.v4,
                   },
    refresh_token:      [String],
    permissions:   {
                        type: [String],
                        default: [],
                   },
    method:        {
                        type: String,
                        enum: ['local', 'facebook'],
                        required: true,
                   },
    email:         {
                        type: String,
                        validate: [isEmail, 'Invalid Email'],
                        lowercase: true,
                    },
    local:          {
                        password: {
                            type: String,
                        }
                    },
    facebookProvider: {
                        type: {
                            id: String,
                            access_token: String,
                        },
                        select: false,
                      }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

user_schema.pre('save', async function (next) {
    if (this.method !== 'local') {
        return next();
    }
    if (!this.isModified('local.password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(config.SALT_WORK_FACTOR);

        this.local.password = await bcrypt.hash(this.local.password, salt);

        next();
    } catch (err) {
        return next(err);
    }
});

user_schema.methods.validatePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.local.password);
    } catch (err) {
        throw err;
    }
};

user_schema.plugin(mongooseDelete, { overrideMethods: true, deletedAt: true, validateBeforeDelete: false });

const User = mongoose.model('User', user_schema);

module.exports = User;