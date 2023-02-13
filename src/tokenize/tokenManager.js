const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
    // generateAccessTokey(payload) {
    //     return Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
    // },

    // ! Memanfaatkan arrow function
    generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),

    // tips keamanan nilai key dari token JWT bisa dibuat string secara random dengan menggunakan
    // perintah pada node REPL : ketik pada termial node selanjutnya masukkan perintah require('crypto').randomBytes(64).toString('hex'); 
    // kemudian enter maka akan secara otomatis generate string random

    // membuat fungsi generateRefreshToken
    generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),

    // tips melakukan generate key refresh token pada node REPL:
    // require('crypto').randomBytes(64).toString('hex');

    verifyRefreshToken: (refreshToken) => {
        try {
            const artifacts = Jwt.token.decode(refreshToken);
            Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
            const { payload } = artifacts.decoded;
            return payload;
        } catch (error) {
            throw new InvariantError('Refresh token tidak valid');
        }
    },
};

module.exports = TokenManager;