const Joi = require('joi');
const { AlbumPayloadSchema } = require('../../../validator/albums/schema');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: handler.postAlbumHandler,
    options: {
      tags: ['api', 'albums'],
      validate: { payload: AlbumPayloadSchema },
      plugins: { 'hapi-swagger': { security: [] } },
    },
  },
  {
    method: 'GET',
    path: '/albums',
    handler: handler.getAlbumsHandler,
    options: { tags: ['api', 'albums'], plugins: { 'hapi-swagger': { security: [] } } },
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: handler.getAlbumByIdHandler,
    options: {
      tags: ['api', 'albums'],
      validate: { params: Joi.object({ id: Joi.string().required() }) },
      plugins: { 'hapi-swagger': { security: [] } },
    },
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: handler.putAlbumByIdHandler,
    options: {
      tags: ['api', 'albums'],
      validate: {
        params: Joi.object({ id: Joi.string().required() }),
        payload: AlbumPayloadSchema,
      },
      plugins: { 'hapi-swagger': { security: [] } },
    },
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: handler.deleteAlbumByIdHandler,
    options: {
      tags: ['api', 'albums'],
      validate: { params: Joi.object({ id: Joi.string().required() }) },
      plugins: { 'hapi-swagger': { security: [] } },
    },
  },
];

module.exports = routes;
