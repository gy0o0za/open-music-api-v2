const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
require('dotenv').config();

const createContainer = require('./container');
const errorHandler = require('./exceptions/errorHandler');

// routes
const albumsRoutes = require('./api/albums/routes');
const songsRoutes = require('./api/songs/routes');
const usersRoutes = require('./api/users/routes');
const authenticationsRoutes = require('./api/authentications/routes');
const authentications = require('./api/authentications');

const playlistsRoutes = require('./api/playlists/routes');

const init = async () => {
  const { handlers } = createContainer();

  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
  });

  // Registrasi plugin
  await server.register([Jwt, Inert, Vision, {
    plugin: HapiSwagger,
    options: {
      info: {
        title: 'Open Music API',
        version: 'v2',
      },
      grouping: 'tags',
      schemes: ['http'],
      securityDefinitions: {
        jwt: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          'x-bearer-format': 'JWT',
          description: 'Masukkan token dengan format: Bearer <token>',
        },
      },
    },
  }]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: { id: artifacts.decoded.payload.userId },
    }),
  });

  // Routes
  server.route(albumsRoutes(handlers.albumsHandler));
  server.route(songsRoutes(handlers.songsHandler));
  server.route(usersRoutes(handlers.usersHandler));
  server.route(authenticationsRoutes(handlers.authenticationsHandler));
  server.route(playlistsRoutes(handlers.playlistsHandler));

  // Note: no custom UI script; keep default to avoid UI issues

  // Error handling
  server.ext('onPreResponse', errorHandler);

  await server.start();
  console.log(`🚀 Server running at: ${server.info.uri}`);
};

init();
