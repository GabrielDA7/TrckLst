const { reject } = require('bluebird');
const { Schema, model } = require('mongoose');
const { NOT_FOUND } = require('http-status');
const { omit } = require('lodash');
const APIError = require('../libs/apiError');

/**
 * User Schema
 */
const UserSchema = new Schema({
  spotify_id: {
    type: String,
  },
  spotify_access_token: {
    type: String,
  },
  spotify_refresh_token: {
    type: String,
  },
  spotify_token_expires_at: {
    type: Date,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
UserSchema.method({
  safeModel() {
    return omit(this.toObject(), ['__v', 'spotify_access_token', 'spotify_refresh_token']);
  },
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', NOT_FOUND, true);
        return reject(err);
      });
  },
};

/**
 * @typedef User
 */
module.exports = model('User', UserSchema);
