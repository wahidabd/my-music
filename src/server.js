require('dotenv').config();
const Hapi = require("@hapi/hapi");
const Jwt = require('@hapi/jwt');

// album
const albums = require('./api/albums');
const AlbumService = require('./service/postgres/AlbumsService');
const AlbumValidator = require('./validator/albums');

// song
const songs = require('./api/songs');
const SongService = require('./service/postgres/SongsService');
const SongValidator = require('./validator/songs');

// authentication
const authentications = require('./api/authentications')
const AuthenticationsService = require('./service/postgres/AuthenticationsService')
const AuthenticationsValidator = require('./validator/authentications')
const TokenManager = require('./tokenize/TokenManagaer')

// users
const users = require('./api/users')
const UsersService = require('./service/postgres/UsersService')
const UsersValidator = require('./validator/users')

// collaborations
const collaborations = require('./api/collaborations')
const CollaborationsService = require('./service/postgres/CollaborationsService')
const CollaborationsValidator = require('./validator/collaborations')

// playlists
const playlists = require('./api/playlists')
const PlaylistsService = require('./service/postgres/PlaylistsService')
const PlaylistsValidator = require('./validator/playlists')

const init = async () => {

    const albumService = new AlbumService();
    const songsService = new SongService();
    const authenticationsService = new AuthenticationsService();
    const usersService = new UsersService();
    const collaborationsService = new CollaborationsService()
    const playlistsService = new PlaylistsService(collaborationsService)

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
            plugin: Jwt
        }
    ]);

    server.auth.strategy('mymusic_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id
            }
        })
    })

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
                service: songsService,
                validator: SongValidator
            }
        },
        {
            plugin: authentications,
            options: {
                authenticationsService,
                usersService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator
            }
        },
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator
            }
        },
        {
           plugin: playlists,
           options: {
               playlistsService,
               songsService,
               validator: PlaylistsValidator
           }
        },
        {
            plugin: collaborations,
            options: {
                collaborationsService,
                playlistsService,
                usersService,
                validator: CollaborationsValidator
            }
        }
    ]);

    await server.start()
    console.log(`Server berjalan pada ${server.info.uri}`);
}

init();
