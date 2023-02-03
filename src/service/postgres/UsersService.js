const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UsersService {
    constructor() {
        this._pool = new Pool();
    }

    // Fungsi Add User
    async addUser({
        username,
        password,
        fullname
    }) {
        // TODO : Verifikasi username, pastikan belum terdaftar
        await this.verfiyNewUsername(username);
        
        // TODO : Bila verifikasi lolos, maka masukan user baru ke database.
        const id = `user-${nanoid(16)}`;
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = {
            text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, username, hashedPassword, fullname],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('User gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    // Fungsi Verifikasi User Baru
    async verfiyNewUsername(username) {
        const query = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username],
        };

        const result = await this._pool.query(query);

        if (result.rows.length > 0) {
            throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.')
        }
    }

    // Fungsi Get User By Id
    async getUserById(userId) {
        const query = {
            text: 'SELECT id, username, fullname FROM users WHERE id = $1',
            values: [userId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) { // coba di ganti menggunakan rowCount yang seharusnya rows.length
            throw new NotFoundError('User tidak ditemukan');
        }

        return result.rows[0];
    }

}

module.exports = UsersService;