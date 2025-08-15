const AlbumsValidator = require('../../../validator/albums');

class AlbumsHandler {
  constructor(albumsService, songsService) {
    this._albumsService = albumsService;
    this._songsService = songsService;
  }

  postAlbumHandler = async (request, h) => {
    AlbumsValidator.validateAlbumPayload(request.payload);
    const albumId = await this._albumsService.addAlbum(request.payload);

    return h.response({
      status: 'success',
      data: { albumId },
    }).code(201);
  };

  getAlbumsHandler = async () => {
    const albums = await this._albumsService.getAlbums();
    return {
      status: 'success',
      data: { albums: albums || [] },
    };
  };

  getAlbumByIdHandler = async (request) => {
    const { id } = request.params;
    const album = await this._albumsService.getAlbumById(id);
    const songs = await this._songsService.getSongsByAlbumId(id);

    return {
      status: 'success',
      data: {
        album: {
          ...album,
          songs: songs || [],
        },
      },
    };
  };

  putAlbumByIdHandler = async (request) => {
    AlbumsValidator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    await this._albumsService.editAlbumById(id, request.payload);
    return { status: 'success', message: 'Album updated' };
  };

  deleteAlbumByIdHandler = async (request) => {
    const { id } = request.params;
    await this._albumsService.deleteAlbumById(id);
    return { status: 'success', message: 'Album deleted' };
  };
}

module.exports = AlbumsHandler;
