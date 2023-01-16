/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('users', {
        id: {
            type: 'VARCHAR(32)',
            primaryKey: true,
        },
        username: {
            type: 'VARCHAR(64)',
            unique: true,
            notNull: true,
        },
        password: {
            type: 'TEXT',
            notNull: true,
        },
        fullname: {
            type: 'VARCHAR(255)',
            notNull: true,
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('users');
};
