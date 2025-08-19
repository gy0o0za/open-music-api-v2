const Joi = require('joi');
const { PostPlaylistSchema, PostPlaylistSongSchema } = require('../../../validator/playlists/schema');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
    options: {
      auth: 'openmusic_jwt',
      tags: ['api', 'playlists'],
      validate: { payload: PostPlaylistSchema },
      plugins: { 'hapi-swagger': { security: [{ jwt: [] }] } },
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistsHandler,
    options: {
      auth: 'openmusic_jwt',
      tags: ['api', 'playlists'],
      plugins: { 'hapi-swagger': { security: [{ jwt: [] }] } },
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: handler.deletePlaylistHandler,
    options: {
      auth: 'openmusic_jwt',
      tags: ['api', 'playlists'],
      validate: { params: Joi.object({ id: Joi.string().required() }) },
      plugins: { 'hapi-swagger': { security: [{ jwt: [] }] } },
    },
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.postSongToPlaylistHandler,
    options: {
      auth: 'openmusic_jwt',
      tags: ['api', 'playlists'],
      validate: {
        params: Joi.object({ id: Joi.string().required() }),
        payload: PostPlaylistSongSchema,
      },
      plugins: { 'hapi-swagger': { security: [{ jwt: [] }] } },
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: handler.getSongsFromPlaylistHandler,
    options: {
      auth: 'openmusic_jwt',
      tags: ['api', 'playlists'],
      validate: { params: Joi.object({ id: Joi.string().required() }) },
      plugins: { 'hapi-swagger': { security: [{ jwt: [] }] } },
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: handler.deleteSongFromPlaylistHandler,
    options: {
      auth: 'openmusic_jwt',
      tags: ['api', 'playlists'],
      validate: {
        params: Joi.object({ id: Joi.string().required() }),
        payload: PostPlaylistSongSchema,
      },
      plugins: { 'hapi-swagger': { security: [{ jwt: [] }] } },
    },
  },
];

module.exports = routes;
