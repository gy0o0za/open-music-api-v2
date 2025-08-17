const routes = require('./routes');
const Handler = require('./handler');

module.exports = {
  name: 'authentications',
  register: async (server, { authService, usersService, tokenManager, validator }) => {
    const handler = new Handler(authService, usersService, tokenManager, validator);
    server.route(routes(handler));
  },
};
