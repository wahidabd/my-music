const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');
const AuthenticationError = require('../../exception/AuthenticationError');

class UsersService {

    constructor() {
        this._pool = new Pool();
    }

    async addUser({username, password, fullname}) {
        await this.verifyUsername(username);

        const id = `user-${nanoid(16)}`
        const hashedPassword = await bcrypt.hash(password, 10)

        const query = {
            text: 'INSERT INTO users VALUES ($1, $2, $3, $4) RETURNING id',
            values: [id, username, hashedPassword, fullname]
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Failed add user')
        }

        return result.rows[0].id;
    }

    async getUserById(id) {
        const query = {
            text: 'SELECT * FROM users WHERE id = $1',
            values: [id]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new NotFoundError('User not found')
        }

        return result.rows[0]
    }

    async verifyUsername(username) {
        const query = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username]
        }

        const result = await this._pool.query(query);

        if (result.rows.length > 0) {
            throw new InvariantError('Username already exist!')
        }
    }

    async verifyUserCredential(username, password) {
        const query = {
            text: 'SELECT id, password FROM users WHERE username = $1',
            values: [username]
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new AuthenticationError('Invalid credential!')
        }

        const {id, password: hashedPassword} = result.rows[0]
        const isMatch = await bcrypt.compare(password, hashedPassword)

        if (!isMatch) {
            throw new AuthenticationError('Invalid credential!')
        }

        return id;
    }

}

module.exports = UsersService;
