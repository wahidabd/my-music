const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../exception/InvariantError');
const NotFoundError = require('../exception/NotFoundError');

class SongService {

    constructor() {
        this._pool = new Pool();
    }

    async addSong({title, year, genre, performer, duration, albumId}) {
        const id = `song-${nanoid(11)}`;

        const query = {
            text: 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            values: [id, title, year, performer, genre, duration, albumId]
        };

        const result = await this._pool.query(query);

        if (!result.rows.length){
            throw new InvariantError('Failed add song!');
        }

        return result.rows[0].id;
    }

    async getSongs(title, performer) {
        let text = "SELECT id, title, performer FROM songs";
        const values = [];

        if (title) {
            text = text + " WHERE title ILIKE '%' || $1 || '%'";
            values.push(title);
        }

        if (!title && performer) {
            text = text + " WHERE performer ILIKE '%' || $1 || '%'";
            values.push(performer);
        }

        if (title && performer) {
            text = text + " AND performer ILIKE '%' || $2 || '%'";
            values.push(performer);
        }

        const query = {
            text: text,
            values: values,
        };

        const result = await this._pool.query(query);
        return result.rows;
    }

    async getSongById(id) {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Album not found!');
        }

        return result.rows[0];
    }

    async editSong(id, {title, year, genre, performer, duration, albumId}) {
        const query = {
            text: `UPDATE songs
                   SET title     = $1,
                       year      = $2,
                       genre     = $3,
                       performer = $4,
                       duration  = $5,
                       album_id  = $6
                   WHERE id = $7 RETURNING id`,
            values: [title, year, genre, performer, duration, albumId, id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Failed update song!');
        }
    }

    async deleteSong(id) {
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Failed delete song!');
        }
    }
}

module.exports = SongService;
