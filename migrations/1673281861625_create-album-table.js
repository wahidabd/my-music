/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('albums', {
        id: {
            type: 'VARCHAR(16)',
            primaryKey: true
        },
        name: {
            type: 'VARCHAR(126)',
            notNull: true,
        },
        year: {
            type: 'INT',
            notNull: true
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('albums')
};
