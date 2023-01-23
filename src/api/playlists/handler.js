const ClientError = require('../../exception/ClientError')

class PlaylistsHandler {

    constructor(playlistsService, songsService, validator) {
        this._playlistsService = playlistsService
        this._songsService = songsService
        this._validator = validator

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this)
        this.getPlaylistHandler = this.getPlaylistHandler.bind(this)
        this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this)
        this.postPlaylistSongByIdHandler = this.postPlaylistSongByIdHandler.bind(this)
        this.getPlaylistSongByIdHandler = this.getPlaylistSongByIdHandler.bind(this)
        this.deletePlaylistSongByIdHandler = this.deletePlaylistSongByIdHandler.bind(this)
        this.getPlaylistActivityByIdHandler = this.getPlaylistActivityByIdHandler.bind(this)
    }

    async postPlaylistHandler(request, h) {
        try {
            this._validator.validatePlaylistPayload(request.payload)

            const {name} = request.payload
            const {id: credentialId} = request.auth.credentials

            const playlistId = await this._playlistsService.addPlaylist(name, credentialId);

            const response = h.response({
                status: 'success',
                data: {
                    playlistId
                }
            })

            response.code(201)
            return response
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });
                response.code(error.statusCode);
                return response;
            }

            const response = h.response({
                status: 'error',
                message: 'Sorry, something has gone wrong with the server!',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async getPlaylistHandler(request, h) {
        try {
            const {id: credentialId} = request.auth.credentials;
            const playlists = await this._playlistsService.getPlaylists(credentialId)

            return {
                status: 'success',
                data: {
                    playlists
                }
            }

        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });
                response.code(error.statusCode);
                return response;
            }

            const response = h.response({
                status: 'error',
                message: 'Sorry, something has gone wrong with the server!',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async deletePlaylistHandler(request, h) {
        try {
            const {id} = request.params;
            const {id: credentialId} = request.auth.credentials;

            await this._playlistsService.verifyPlaylistOwner(id, credentialId)
            await this._playlistsService.deletePlaylist(id)

            return {
                status: 'success',
                message: 'Success delete playlist'
            }
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });
                response.code(error.statusCode);
                return response;
            }

            const response = h.response({
                status: 'error',
                message: 'Sorry, something has gone wrong with the server!',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async postPlaylistSongByIdHandler(request, h) {
        try {
            this._validator.validateSongPlaylistPayload(request.payload)

            const {songId} = request.payload
            const {id: credentialId} = request.auth.credentials;
            const {id: playlistId} = request.params;

            await this._songsService.getSongById(songId)
            await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
            await this._playlistsService.addSongToPlaylist(playlistId, songId)
            await this._playlistsService.addActivity(playlistId, songId, credentialId, 'add')

            const response = h.response({
                status: 'success',
                message: 'Success added music in playlist'
            })
            response.code(201)
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });
                response.code(error.statusCode);
                return response;
            }

            const response = h.response({
                status: 'error',
                message: 'Sorry, something has gone wrong with the server!',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async getPlaylistSongByIdHandler(request, h) {
        try {
            const {id} = request.params;
            const {id: credentialId} = request.auth.credentials;
            const playlist = await this._playlistsService.getPlaylistSongsById(id, credentialId)

            return {
                status: 'success',
                data: {
                    playlist
                }
            }
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });
                response.code(error.statusCode);
                return response;
            }

            const response = h.response({
                status: 'error',
                message: 'Sorry, something has gone wrong with the server!',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async deletePlaylistSongByIdHandler(request, h) {
        try {
            this._validator.validateSongPlaylistPayload(request.payload)

            const {id} = request.params;
            const {songId} = request.payload;
            const {id: credentialId} = request.auth.credentials;

            await this._playlistsService.verifyPlaylistAccess(id, credentialId)
            await this._playlistsService.deleteSongFromPlaylist(id, songId)
            await this._playlistsService.addActivity(id, songId, credentialId, 'delete')

            return {
                status: 'success',
                message: 'Success delete music from playlist'
            }
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });
                response.code(error.statusCode);
                return response;
            }

            const response = h.response({
                status: 'error',
                message: 'Sorry, something has gone wrong with the server!',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async getPlaylistActivityByIdHandler(request, h) {
        try {

            const {id} = request.params;
            const {id: credentialId} = request.auth.credentials;

            await this._playlistsService.verifyPlaylistAccess(id, credentialId)

            const activities = await this._playlistsService.getPlaylistActivitiesById(id)

            return {
                status: 'success',
                data: {
                    playlist: id,
                    activities
                }
            }

        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });
                response.code(error.statusCode);
                return response;
            }

            const response = h.response({
                status: 'error',
                message: 'Sorry, something has gone wrong with the server!',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }
}

module.exports = PlaylistsHandler;
