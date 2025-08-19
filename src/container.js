const { Pool } = require('pg');

// services
const AlbumsService = require('./services/postgres/AlbumsService');
const SongsService = require('./services/postgres/SongsService');
const UsersService = require('./services/postgres/UsersService');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistActivitiesService = require('./services/postgres/PlaylistActivitiesService');
const CollaborationsService = require('./services/postgres/CollaborationsService');

// handlers
const AlbumsHandler = require('./api/albums/handler');
const SongsHandler = require('./api/songs/handler');
const UsersHandler = require('./api/users/handler');
const AuthenticationsHandler = require('./api/authentications/handler');
const PlaylistsHandler = require('./api/playlists/handler');

// validators
const UsersValidator = require('../validator/users');
const AuthValidator = require('../validator/authentications');
const PlaylistsValidator = require('../validator/playlists');

function createContainer() {
  const pool = new Pool();

  const services = {
    albumsService: new AlbumsService(pool),
    songsService: new SongsService(pool),
    usersService: new UsersService(pool),
    authenticationsService: new AuthenticationsService(),
    collaborationsService: new CollaborationsService(),
    activitiesService: new PlaylistActivitiesService(),
    playlistsService: new PlaylistsService(),
  };

  const handlers = {
    albumsHandler: new AlbumsHandler(services.albumsService, services.songsService),
    songsHandler: new SongsHandler(services.songsService),
    usersHandler: new UsersHandler(services.usersService, UsersValidator),
    authenticationsHandler: new AuthenticationsHandler(
      services.authenticationsService,
      services.usersService,
      require('./tokenize/JwtTokenManager'),
      AuthValidator,
    ),
    playlistsHandler: new PlaylistsHandler(
      new PlaylistsService(services.collaborationsService, services.activitiesService),
      services.songsService,
      PlaylistsValidator,
    ),
  };

  return { services, handlers };
}

module.exports = createContainer;
