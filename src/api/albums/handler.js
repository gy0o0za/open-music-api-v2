const AlbumsValidator = require('../../../validator/albums');

class AlbumsHandler {
  constructor(service) {
    this._service = service;
  }

  postAlbumHandler = async (request, h) => {
    AlbumsValidator.validateAlbumPayload(request.payload);

    const albumId = await this._service.addAlbum(request.payload);
    return h.response({
      status: 'success',
      data: { albumId },
    }).code(201);
  };

  getAlbumsHandler = async () => {
  const albums = await this._service.getAlbums();
  return {
    status: 'success',
    data: { albums: albums || [] },
  };
};


  getAlbumByIdHandler = async (request) => {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    const songs = await this._songsService.getSongsByAlbumId(id);

    
  };

  putAlbumByIdHandler = async (request) => {
    AlbumsValidator.validateAlbumPayload(request.payload);

    const { id } = request.params;
    await this._service.editAlbumById(id, request.payload);
    return { status: 'success', message: 'Album updated' };
  };

  deleteAlbumByIdHandler = async (request) => {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    return { status: 'success', message: 'Album deleted' };
  };
}

module.exports = AlbumsHandler;
