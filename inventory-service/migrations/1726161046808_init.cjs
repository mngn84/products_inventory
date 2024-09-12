/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('products', {
        id: {
            type: 'serial',
            primaryKey: true,
        },
        plu: {
            type: 'integer',
            notNull: true,
            unique: true,
        },
        name: {
            type: 'varchar(255)',
            notNull: true,
        },
    }, {
        ifNotExists: true,
    });

    pgm.createTable('inventory', {
        prod_id: {
            type: 'integer',
            notNull: true,
        },
        shop_id: {
            type: 'integer',
            notNull: true,
        },
        shelf_qty: {
            type: 'integer',
            notNull: true,
        },
        order_qty: {
            type: 'integer',
            notNull: true,
        },
    }, {
        ifNotExists: true,
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => { 
    pgm.dropTable('products');
    pgm.dropTable('inventory');
};
