const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists',
        handler: handler.postPlaylistHandler,
        options: {
            auth: 'mymusic_jwt'
        }
    },
    {
        method: 'GET',
        path: '/playlists',
        handler: handler.getPlaylistHandler,
        options: {
            auth: 'mymusic_jwt'
        }
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: handler.deletePlaylistHandler,
        options: {
            auth: 'mymusic_jwt'
        }
    },
    {
        method: 'POST',
        path: '/playlists/{id}/songs',
        handler: handler.postPlaylistSongByIdHandler,
        options: {
            auth: 'mymusic_jwt'
        }
    },
    {
        method: 'GET',
        path: '/playlists/{id}/songs',
        handler: handler.getPlaylistSongByIdHandler,
        options: {
            auth: 'mymusic_jwt'
        }
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}/songs',
        handler: handler.deletePlaylistSongByIdHandler,
        options: {
            auth: 'mymusic_jwt'
        }
    },
    {
        method: 'GET',
        path: '/playlists/{id}/activities',
        handler: handler.getPlaylistActivityByIdHandler,
        options: {
            auth: 'mymusic_jwt'
        }
    }
]

module.exports = routes;
