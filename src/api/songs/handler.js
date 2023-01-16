const ClientError = require('../../exception/ClientError');

class SongHandler {

    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongsHandler = this.getSongsHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }

    async postSongHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);

            const {
                title, year,
                genre, performer,
                duration = null,
                albumId = null
            } = request.payload;

            const songId = await this._service.addSong({
                title, year, genre, performer, duration, albumId
            });

            const response = h.response({
                status: 'success',
                data: {
                    songId
                }
            });

            response.code(201);
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

    async getSongsHandler(request, h) {
        try {
            const {title = null, performer = null} = request.query;
            const songs = await this._service.getSongs(title, performer);

            return {
                status: 'success',
                data: {
                    songs
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

    async getSongByIdHandler(request, h) {
        try {

            const {id} = request.params;
            const song = await this._service.getSongById(id);

            return {
                status: 'success',
                data: {
                    song
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

    async putSongByIdHandler(request, h) {
        try {

            this._validator.validateSongPayload(request.payload);
            const {id} = request.params;

            const {
                title, year,
                genre, performer,
                duration = null, albumId = null
            } = request.payload;

            await this._service.editSong(id, {
                title, year, genre, performer, duration, albumId
            });

            return {
                status: 'success',
                message: 'Success update song!'
            };

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

    async deleteSongByIdHandler(request, h) {
        try {
            const {id} = request.params;
            await this._service.deleteSong(id);

            return {
                status: 'success',
                message: 'Success delete song!'
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

module.exports = SongHandler;
