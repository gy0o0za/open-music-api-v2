const { UserPayloadSchema } = require('../../../validator/users/schema');

const routes = (handler) => ([
  { method: 'POST', path: '/users', handler: (r,h)=>handler.postUserHandler(r,h), options: { tags: ['api', 'users'], validate: { payload: UserPayloadSchema }, plugins: { 'hapi-swagger': { security: [] } } } },
]);
module.exports = routes;
