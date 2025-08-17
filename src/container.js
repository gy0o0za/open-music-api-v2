const { Pool } = require('pg');

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

function createContainer() {
  const pool = new Pool();

  const services = {
    albumsService: new AlbumsService(pool),
    songsService: new SongsService(pool),
    usersService: new UsersService(pool),
    authenticationsService: new AuthenticationsService(),
    playlistsService: new PlaylistsService(pool),
  };

  const handlers = {
    albumsHandler: new AlbumsHandler(services.albumsService, services.songsService),
    songsHandler: new SongsHandler(services.songsService),
    usersHandler: new UsersHandler(services.usersService),
    authenticationsHandler: new AuthenticationsHandler(
      services.authenticationsService,
      services.usersService,
    ),
    playlistsHandler: new PlaylistsHandler(services.playlistsService, services.songsService),
  };

  return { services, handlers };
}

module.exports = createContainer;
