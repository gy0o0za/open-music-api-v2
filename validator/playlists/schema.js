const Joi = require('joi');

const PostPlaylistSchema = Joi.object({
  name: Joi.string().required(),
});

const PostPlaylistSongSchema = Joi.object({
  songId: Joi.string().required(),
});

const PostCollaborationSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = {
  PostPlaylistSchema,
  PostPlaylistSongSchema,
  PostCollaborationSchema,
};
