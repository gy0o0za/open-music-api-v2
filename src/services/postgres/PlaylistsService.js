const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor(collaborationsService, activitiesService) {
    this._pool = new Pool();
    this._collabService = collaborationsService;
    this._activities = activitiesService; // boleh null kalau tidak pakai opsional
  }

  async addPlaylist(name, owner) {
    const id = `playlist-${nanoid(16)}`;
    const res = await this._pool.query({
      text: 'INSERT INTO playlists VALUES($1,$2,$3) RETURNING id',
      values: [id, name, owner],
    });
    return res.rows[0].id;
  }

  async getPlaylists(owner) {
    const query =
      `SELECT p.id, p.name, u.username
       FROM playlists p
       LEFT JOIN users u ON u.id = p.owner
       LEFT JOIN collaborations c ON c.playlist_id = p.id
       WHERE p.owner=$1 OR c.user_id=$1
       GROUP BY p.id, u.username
       ORDER BY p.id`;
    const res = await this._pool.query({ text: query, values: [owner] });
    return res.rows;
  }

  async deletePlaylistById(id, owner) {
    await this.verifyPlaylistOwner(id, owner);
    await this._pool.query({ text: 'DELETE FROM playlists WHERE id=$1', values: [id] });
  }

  async addSongToPlaylist(playlistId, songId, userId) {
    await this.verifyPlaylistAccess(playlistId, userId);
    const id = `plsong-${nanoid(16)}`;
    await this._pool.query({
      text: 'INSERT INTO playlistsongs VALUES($1,$2,$3)',
      values: [id, playlistId, songId],
    });
    if (this._activities) await this._activities.add(playlistId, songId, userId, 'add');
  }

  async getSongsInPlaylist(playlistId, userId) {
    await this.verifyPlaylistAccess(playlistId, userId);
    const playlistQ = await this._pool.query({
      text: `SELECT p.id, p.name, u.username
             FROM playlists p JOIN users u ON u.id=p.owner
             WHERE p.id=$1`,
      values: [playlistId],
    });
    if (!playlistQ.rowCount) throw new NotFoundError('Playlist tidak ditemukan');

    const songsQ = await this._pool.query({
      text: `SELECT s.id, s.title, s.performer
             FROM playlistsongs ps JOIN songs s ON s.id = ps.song_id
             WHERE ps.playlist_id=$1`,
      values: [playlistId],
    });

    return { ...playlistQ.rows[0], songs: songsQ.rows };
  }

  async deleteSongFromPlaylist(playlistId, songId, userId) {
    await this.verifyPlaylistAccess(playlistId, userId);
    await this._pool.query({
      text: 'DELETE FROM playlistsongs WHERE playlist_id=$1 AND song_id=$2',
      values: [playlistId, songId],
    });
    if (this._activities) await this._activities.add(playlistId, songId, userId, 'delete');
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const res = await this._pool.query({ text: 'SELECT owner FROM playlists WHERE id=$1', values: [playlistId] });
    if (!res.rowCount) throw new NotFoundError('Playlist tidak ditemukan');
    if (res.rows[0].owner !== owner) throw new AuthorizationError('Anda tidak berhak');
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (e) {
      if (e instanceof NotFoundError) throw e;
      if (!this._collabService) throw e;
      await this._collabService.verifyCollaborator(playlistId, userId);
    }
  }

  async deletePlaylistById(id) {
  const result = await this._pool.query({
    text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
    values: [id],
  });

  if (!result.rowCount) {
    throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
  }
}


}
module.exports = PlaylistsService;
