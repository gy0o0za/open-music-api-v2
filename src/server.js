const Hapi = require('@hapi/hapi');
const { Pool } = require('pg');
require('dotenv').config();

const ClientError = require('./exceptions/ClientError');

const AlbumsService = require('./services/postgres/AlbumsService');
const SongsService = require('./services/postgres/SongsService');

const AlbumsHandler = require('./api/albums/handler');
const SongsHandler = require('./api/songs/handler');

const albumsRoutes = require('./api/albums/routes');
const songsRoutes = require('./api/songs/routes');




const init = async () => {
  const pool = new Pool();

  const albumsService = new AlbumsService(pool);
  const songsService = new SongsService(pool);

  const albumsHandler = new AlbumsHandler(albumsService);
  const songsHandler = new SongsHandler(songsService);

  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
  });

  server.route(albumsRoutes(albumsHandler));
  server.route(songsRoutes(songsHandler));

 server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      // error custom kita
      if (response instanceof ClientError) {
        return h
          .response({
            status: 'fail',
            message: response.message,
          })
          .code(response.statusCode);
      }

      // error bawaan hapi (misalnya 404 karena route nggak ada)
      if (!response.isServer) {
        return h
          .response({
            status: 'fail',
            message: response.message,
          })
          .code(response.output.statusCode);
      }

      // error internal server
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
