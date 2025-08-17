const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor(collabService, playlistsService, validator) {
    this._collabService = collabService;
    this._playlistsService = playlistsService;
    this._validator = validator;
    autoBind(this);
  }

  async postCollabHandler(request, h) {
    this._validator.validatePostCollaborationPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const owner = request.auth.credentials.id;
    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);

    const collaborationId = await this._collabService.addCollaboration(playlistId, userId);
    const response = h.response({ status: 'success', data: { collaborationId } });
    response.code(201);
    return response;
  }

  async deleteCollabHandler(request) {
    this._validator.validatePostCollaborationPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const owner = request.auth.credentials.id;
    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
    await this._collabService.deleteCollaboration(playlistId, userId);
    return { status: 'success', message: 'Kolaborasi dihapus' };
  }
}
module.exports = CollaborationsHandler;
