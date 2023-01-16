/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('songs', {
        id: {
            type: 'VARCHAR(16)',
            primaryKey: true,
        },
        title: {
            type: 'VARCHAR(255)',
            notNull: true,
        },
        year: {
            type: 'INT',
            notNull: true,
        },
        performer: {
            type: 'VARCHAR(255)',
            notNull: true,
        },
        genre: {
            type: 'VARCHAR(128)',
            notNull: true,
        },
        duration: {
            type: 'INT',
        },
        album_id: {
            type: 'VARCHAR(16)',
            references: '"albums"',
            onDelete: 'cascade',
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('songs');
};
