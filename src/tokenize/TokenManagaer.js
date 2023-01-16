const Jwt = require('@hapi/jwt');
const InvariantError = require('../exception/InvariantError');
const {ref} = require("joi");

const TokenManager = {
    generateAccessToken(payload) {
        return Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY)
    },

    generateRefreshToken(payload) {
        return Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY)
    },

    verifyRefreshToken(refreshToken) {
        try {
            const artifacts = Jwt.token.decode(refreshToken);
            Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);

            const {payload} = Jwt.token.decode(refreshToken);
            return payload;
        }catch (error){
            throw new InvariantError('Invalid refresh token')
        }
    }
}

module.exports = TokenManager;
