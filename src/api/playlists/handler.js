const autoBind = require('auto-bind');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistsHandler {
  constructor(playlistsService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;
    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: owner } = request.auth.credentials; // from JWT
    const playlistId = await this._playlistsService.addPlaylist(name, owner);

    const response = h.response({ status: 'success', data: { playlistId } });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: owner } = request.auth.credentials;
    const playlists = await this._playlistsService.getPlaylists(owner);
    return { status: 'success', data: { playlists } };
  }

  async deletePlaylistHandler(request) {
    const { id } = request.params;
    const { id: owner } = request.auth.credentials;
    await this._playlistsService.deletePlaylistById(id, owner);
    return { status: 'success', message: 'Playlist berhasil dihapus' };
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistSongPayload(request.payload);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: userId } = request.auth.credentials;

    // pastikan song valid
    await this._songsService.getSongById(songId);

    await this._playlistsService.addSongToPlaylist(playlistId, songId, userId);
    const response = h.response({ status: 'success', message: 'Lagu berhasil ditambahkan ke playlist' });
    response.code(201);
    return response;
  }

  async getSongsFromPlaylistHandler(request) {
    const { id } = request.params;
    const { id: userId } = request.auth.credentials;

    const playlist = await this._playlistsService.getSongsInPlaylist(id, userId);
    return { status: 'success', data: { playlist } };
  }

  async deleteSongFromPlaylistHandler(request) {
    this._validator.validatePostPlaylistSongPayload(request.payload);
    const { id } = request.params;
    const { songId } = request.payload;
    const { id: userId } = request.auth.credentials;

    await this._playlistsService.deleteSongFromPlaylist(id, songId, userId);
    return { status: 'success', message: 'Lagu berhasil dihapus dari playlist' };
  }

}
module.exports = PlaylistsHandler;
