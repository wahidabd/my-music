const InvariantError = require('../../exception/InvariantError');
const {
    PlaylistPayloadScheme,
    SongPlaylistPayloadScheme
} = require('schema');

const PlaylistsValidator = {
    validatePlaylistPayload: (payload) => {
        const validationResult = PlaylistPayloadScheme.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },

    validateSongPlaylistPayload: (payload) => {
        const validationResult = SongPlaylistPayloadScheme.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
}

module.exports = PlaylistsValidator;
