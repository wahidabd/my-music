const Joi = require('joi');

const PlaylistPayloadScheme = Joi.object({
    name: Joi.string().required(),
});

const SongPlaylistPayloadScheme = Joi.object({
    songId: Joi.string().required(),
});

module.exports = {
    PlaylistPayloadScheme,
    SongPlaylistPayloadScheme
}
