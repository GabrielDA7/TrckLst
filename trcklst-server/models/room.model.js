const { reject } = require('bluebird');
const { Schema, model } = require('mongoose');
const { NOT_FOUND } = require('http-status');
const APIError = require('../libs/apiError');

/**
 * Room Schema
 */
const RoomSchema = new Schema({
  owner_id: {
    type: String,
    required: true,
  },
  spotify_playlist_uri: {
    type: String,
    required: true,
  },
  device_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  guests: [{
      user_id: {
          type: String,
          required: true,
      }
  }],
  tracks: [{
    uri: {
      type: String,
      required: true,
    },
    artist: {
        type: String,
        required: true,
    },
    album: {
        type: String,
        required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    voter: [{
      user_id: {
        type: String,
        required: true,
      }
    }],
  }],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

/**
 * - pre-post-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
RoomSchema.method({});

/**
 * Statics
 */
RoomSchema.statics = {
  /**
   * Get Room
   * @param {ObjectId} id - The objectId of Room.
   * @returns {Promise<Room, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((room) => {
        if (room) {
          return room;
        }
        const err = new APIError('No such room exists!', NOT_FOUND, true);
        return reject(err);
      });
  },
};

/**
 * @typedef Room
 */
module.exports = model('Room', RoomSchema);
