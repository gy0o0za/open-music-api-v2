const routes = require('./routes');
const Handler = require('./handler');

module.exports = {
  name: 'collaborations',
  register: async (server, { collabService, playlistsService, validator }) => {
    const handler = new Handler(collabService, playlistsService, validator);
    server.route(routes(handler));
  },
};
