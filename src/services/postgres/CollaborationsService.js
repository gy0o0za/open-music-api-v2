const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');

class CollaborationsService {
  constructor() { this._pool = new Pool(); }

  async addCollaboration(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;
    const q = { text: 'INSERT INTO collaborations VALUES($1,$2,$3) RETURNING id', values: [id, playlistId, userId] };
    const res = await this._pool.query(q);
    return res.rows[0].id;
  }

  async deleteCollaboration(playlistId, userId) {
    await this._pool.query({ text: 'DELETE FROM collaborations WHERE playlist_id=$1 AND user_id=$2', values: [playlistId, userId] });
  }

  async verifyCollaborator(playlistId, userId) {
    const { rowCount } = await this._pool.query({ text: 'SELECT id FROM collaborations WHERE playlist_id=$1 AND user_id=$2', values: [playlistId, userId] });
    if (!rowCount) throw new AuthorizationError('Anda tidak berhak');
  }
}
module.exports = CollaborationsService;
