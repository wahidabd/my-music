const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');


class AlbumsService {

    constructor() {
        this._pool = new Pool();
    }
    async addAlbum({name, year}) {
        const id = `album-${nanoid(10)}`;

        const query = {
            text: 'INSERT INTO albums VALUES ($1, $2, $3) RETURNING id',
            values: [id, name, year],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id){
            throw new InvariantError('Failed add new album!');
        }

        return result.rows[0].id;
    }

    async getAlbumById(id) {

        const queryAlbum = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id]
        }

        const querySong = {
            text: 'SELECT * FROM songs WHERE album_id = $1',
            values: [id]
        }

        const albumResult = await this._pool.query(queryAlbum);
        const songResult = await this._pool.query(querySong);

        if (!albumResult.rows.length){
            throw new NotFoundError('Album not found!')
        }

        const album = albumResult.rows[0];
        const song = songResult.rows.length ? songResult.rows : null;
        return {
            id: album.id,
            name: album.name,
            year: album.year,
            songs: song
        };
    }

    async editAlbum(id, {name, year}) {
        const query = {
            text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
            values: [name, year, id]
        }

        const result = await this._pool.query(query);

        if (!result.rows.length){
            throw new NotFoundError('Failed update album!');
        }
    }

    async deleteAlbum(id) {
        const query = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Failed delete album!');
        }
    }

}

module.exports = AlbumsService;
