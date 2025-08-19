const Joi = require('joi');
const { SongPayloadSchema } = require('../../../validator/songs/schema');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postSongHandler,
    options: { tags: ['api', 'songs'], validate: { payload: SongPayloadSchema }, plugins: { 'hapi-swagger': { security: [] } } },
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getSongsHandler,
    options: {
      tags: ['api', 'songs'],
      validate: {
        query: Joi.object({
          title: Joi.string().optional(),
          performer: Joi.string().optional(),
        }).optional(),
      },
      plugins: { 'hapi-swagger': { security: [] } },
    },
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getSongByIdHandler,
    options: { tags: ['api', 'songs'], validate: { params: Joi.object({ id: Joi.string().required() }) }, plugins: { 'hapi-swagger': { security: [] } } },
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.putSongByIdHandler,
    options: {
      tags: ['api', 'songs'],
      validate: {
        params: Joi.object({ id: Joi.string().required() }),
        payload: SongPayloadSchema,
      },
      plugins: { 'hapi-swagger': { security: [] } },
    },
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: handler.deleteSongByIdHandler,
    options: { tags: ['api', 'songs'], validate: { params: Joi.object({ id: Joi.string().required() }) }, plugins: { 'hapi-swagger': { security: [] } } },
  },
];

module.exports = routes;
