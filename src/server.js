const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const { Pool } = require('pg');
require('dotenv').config();

const ClientError = require('./exceptions/ClientError');

// services
const AlbumsService = require('./services/postgres/AlbumsService');
const SongsService = require('./services/postgres/SongsService');
const UsersService = require('./services/postgres/UsersService');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const PlaylistsService = require('./services/postgres/PlaylistsService');

// handlers
const AlbumsHandler = require('./api/albums/handler');
const SongsHandler = require('./api/songs/handler');
const UsersHandler = require('./api/users/handler');
const AuthenticationsHandler = require('./api/authentications/handler');
const PlaylistsHandler = require('./api/playlists/handler');

// routes
const albumsRoutes = require('./api/albums/routes');
const songsRoutes = require('./api/songs/routes');
const usersRoutes = require('./api/users/routes');
const authenticationsRoutes = require('./api/authentications/routes');
const playlistsRoutes = require('./api/playlists/routes');

const init = async () => {
  const pool = new Pool();

  // services
  const albumsService = new AlbumsService(pool);
  const songsService = new SongsService(pool);
  const usersService = new UsersService(pool);
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService(pool);

  // handlers
  const albumsHandler = new AlbumsHandler(albumsService, songsService);
  const songsHandler = new SongsHandler(songsService);
  const usersHandler = new UsersHandler(usersService);
  const authenticationsHandler = new AuthenticationsHandler(
    authenticationsService, usersService
  );
  const playlistsHandler = new PlaylistsHandler(playlistsService, songsService);

  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
  });

  // registrasi JWT
  await server.register(Jwt);

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
      credentials: { id: artifacts.decoded.payload.id },
    }),
  });

  // routes
  server.route(albumsRoutes(albumsHandler));
  server.route(songsRoutes(songsHandler));
  server.route(usersRoutes(usersHandler));
  server.route(authenticationsRoutes(authenticationsHandler));
  server.route(playlistsRoutes(playlistsHandler));

  // error handling
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        return h
          .response({
            status: 'fail',
            message: response.message,
          })
          .code(response.statusCode);
      }

      if (!response.isServer) {
        return h
          .response({
            status: 'fail',
            message: response.message,
          })
          .code(response.output.statusCode);
      }

      console.error(response);
      return h
        .response({
          status: 'error',
          message: 'Maaf, terjadi kegagalan pada server kami.',
        })
        .code(500);
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

init();
