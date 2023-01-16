require('dotenv').config();
const Hapi = require("@hapi/hapi");

// album
const albums = require('./api/albums');
const AlbumService = require('./service/AlbumService');
const AlbumValidator = require('./validator/albums');

// song
const songs = require('./api/songs');
const SongService = require('./service/SongService');
const SongValidator = require('./validator/songs');

const init = async () => {

    const albumService = new AlbumService();
    const songService = new SongService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register([
        {
            plugin: albums,
            options: {
                service: albumService,
                validator: AlbumValidator
            }
        },
        {
            plugin: songs,
            options: {
                service: songService,
                validator: SongValidator
            }
        }
    ]);

    await server.start()
    console.log(`Server berjalan pada ${server.info.uri}`);
}

init();
