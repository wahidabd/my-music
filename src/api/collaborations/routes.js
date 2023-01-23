const routes = (handler) => [
    {
        method: 'POST',
        path: '/collaborations',
        handler: handler.postCollaborationHandler,
        options: {
            auth: 'mymusic_jwt'
        }
    },
    {
        method: 'DELETE',
        path: '/collaborations',
        handler: handler.deleteCollaborationHandler,
        options: {
            auth: 'mymusic_jwt'
        }
    }
]

module.exports = routes;
