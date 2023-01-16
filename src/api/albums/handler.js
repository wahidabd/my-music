const ClientError = require('../../exception/ClientError');

class AlbumsHandler {

    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postAlbumHandler = this.postAlbumHandler.bind(this);
        this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
        this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
        this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    }

    async postAlbumHandler(request, h) {
        try {
            this._validator.validateAlbumPayload(request.payload);

            const {name, year} = request.payload;
            const albumId = await this._service.addAlbum({name, year});

            const response = h.response({
                status: 'success',
                data: {
                    albumId
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

    async getAlbumByIdHandler(request, h) {
        try {
            const {id} = request.params;
            const album = await this._service.getAlbumById(id);

            return {
                status: 'success',
                data: {
                    album
                }
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

    async putAlbumByIdHandler(request, h) {
        try {
            this._validator.validateAlbumPayload(request.payload);

            const {id} = request.params;
            const {name, year} = request.payload;

            await this._service.editAlbum(id, {name, year});

            return {
                status: 'success',
                message: 'Success update album!'
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

    async deleteAlbumByIdHandler(request, h) {
        try {

            const {id} = request.params;
            await this._service.deleteAlbum(id);

            return {
                status: 'success',
                message: 'Success delete album!'
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

module.exports = AlbumsHandler;
