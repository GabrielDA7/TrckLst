const { reject } = require('bluebird');
const { Schema, model } = require('mongoose');
const { NOT_FOUND } = require('http-status');
const APIError = require('../libs/apiError');

const optionalCurrentTrackSchema = new Schema({
  _id: { auto: false },
  uri: {
    type: String,
    required: true,
  },
  artist: {
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
  }
});

/**
 * Room Schema
 */
const RoomSchema = new Schema({
  owner_id: {
    type: String,
    required: true,
  },
  played_song_position: {
    type: Number,
    default: -1,
  },
  spotify_playlist_id: {
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
  currentTrack: { type: optionalCurrentTrackSchema, required: false},
  tracks: [{
    uri: {
      type: String,
      required: true,
    },
    artist: {
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
    voters: [{
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
        if (room)
          return room;
        const err = new APIError('Room not found', NOT_FOUND, true);
        return reject(err);
      });
  },
  upVote(roomId, track, voterId) {
    return this.findOneAndUpdate({ "_id": roomId, "tracks.uri": track.uri }, {
      "$push": { "tracks.$.voters": { user_id: voterId } },
      "$inc": { "tracks.$.score": 1 }
    }, { new: true })
      .exec()
      .then((room) => {
        if (room)
          return room;
        const err = new APIError('Room or track not found', NOT_FOUND, true);
        return reject(err);
      });
  }
};

/**
 * @typedef Room
 */
module.exports = model('Room', RoomSchema);
