const autoBind = require('auto-bind');

class PlaylistActivitiesHandler {
  constructor(playlistsService, activitiesService) {
    this._playlistsService = playlistsService;
    this._activitiesService = activitiesService;
    autoBind(this);
  }

  async getActivitiesHandler(request) {
    const { id } = request.params;
    const userId = request.auth.credentials.id;
    await this._playlistsService.verifyPlaylistAccess(id, userId);

    const activities = await this._activitiesService.get(id);
    return { status: 'success', data: { playlistId: id, activities } };
  }
}
module.exports = PlaylistActivitiesHandler;
