const { PostAuthSchema, PutAuthSchema, DeleteAuthSchema } = require('../../../validator/authentications/schema');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: handler.postAuthenticationHandler,
    options: { tags: ['api', 'authentications'], validate: { payload: PostAuthSchema }, plugins: { 'hapi-swagger': { security: [] } } },
  },
  {
    method: 'PUT', 
    path: '/authentications',
    handler: handler.putAuthenticationHandler,
    options: { tags: ['api', 'authentications'], validate: { payload: PutAuthSchema }, plugins: { 'hapi-swagger': { security: [] } } },
  },
  {
    method: 'DELETE',
    path: '/authentications', 
    handler: handler.deleteAuthenticationHandler,
    options: { tags: ['api', 'authentications'], validate: { payload: DeleteAuthSchema }, plugins: { 'hapi-swagger': { security: [] } } },
  },
];

module.exports = routes;