const SongsValidator = require('../../../validator/songs');

class SongsHandler {
  constructor(service) {
    this._service = service;
  }

  postSongHandler = async (request, h) => {
    SongsValidator.validateSongPayload(request.payload);

    const songId = await this._service.addSong(request.payload);
    return h.response({
      status: 'success',
      data: { songId },
    }).code(201);
  };

 getSongsHandler = async (request) => {
  const songs = await this._service.getSongs(request.query);
  return {
    status: 'success',
    data: { songs: songs || [] },
  };
};


  getSongByIdHandler = async (request) => {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    return { status: 'success', data: { song } };
  };

  putSongByIdHandler = async (request) => {
    SongsValidator.validateSongPayload(request.payload);

    const { id } = request.params;
    await this._service.editSongById(id, request.payload);
    return { status: 'success', message: 'Song updated' };
  };

  deleteSongByIdHandler = async (request) => {
    const { id } = request.params;
    await this._service.deleteSongById(id);
    return { status: 'success', message: 'Song deleted' };
  };
}

module.exports = SongsHandler;
