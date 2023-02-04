const { Pool } = require('pg');
const InvarriantError = require('../../exceptions/InvariantError');

class AuthenticationsService {
    constructor() {
        this._pool = new Pool();
    }

    // Fungsi AddRefreshToken (Memasukan refresh token)
    async addRefreshToken(token) {
        const query = {
            text: 'INSERT INTO authentications VALUES($1)',
            values: [token],
        };

        await this._pool.query(query);
    }

    // Fungsi VerifyRefreshToken (Memverifikasi atau memastikan refresh token ada di database)
    async verifyRefreshToken(token) {
        const query = {
            text: 'SELECT token FROM authentications WHERE token = $1',
            values: [token],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvarriantError('Refresh token tidak valid');
        }
    }

    // Fungsi DeleteRefreshToken (Menghapus refresh token)
    async deleteRefreshToken(token) {
        const query = {
            text: 'DELETE FROM authentications WHERE token = $1',
            values: [token],
        };

        await this._pool.query(query);
    }
}

module.exports = AuthenticationsService;