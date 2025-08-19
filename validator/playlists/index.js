const InvariantError = require('../../src/exceptions/InvariantError');
const { PostPlaylistSchema, PostPlaylistSongSchema, PostCollaborationSchema } = require('./schema');

module.exports = {
  validatePostPlaylistPayload: (payload) => {
    const { error } = PostPlaylistSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
  validatePostPlaylistSongPayload: (payload) => {
    const { error } = PostPlaylistSongSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
  validatePostCollaborationPayload: (payload) => {
    const { error } = PostCollaborationSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
};
