import { pool } from '../config/db.js';
import Invetory from '../models/inventory.js';
import { publishEvent } from '../utils/rmq.js';

export const createInventory = async (inventoryData) => {
    try {
        const { prod_id, shop_id, shelf_qty, order_qty } = inventoryData;

        const prodQuery = 'SELECT plu FROM products WHERE id = $1 LIMIT 1';
        const prodResult = await pool.query(prodQuery, [prod_id]);

        if (prodResult.rows.length === 0) {
            return;
        }

        const query = 'INSERT INTO inventory (prod_id, shop_id, shelf_qty, order_qty) VALUES ($1, $2, $3, $4) RETURNING *';
        const result = await pool.query(query, [prod_id, shop_id, shelf_qty, order_qty]);
        const newInventory = Invetory.fromRow(result.rows[0]);

        publishEvent({
            type: 'INVENTORY_CREATED',
            payload: {
                plu: prodResult.rows[0].plu,
                shop_id: newInventory.shopId,
            }
        })

        return newInventory;
    } catch (error) {
        console.error('Error creating inventory:', error);
        throw error;
    }
}

export const updatedInventory = async (id, inventoryData, op) => {
    try {
        const { shelf_qty } = inventoryData;

        const prodQuery = 'SELECT p.plu FROM products p JOIN inventory i ON p.id = i.prod_id WHERE i.id = $1 LIMIT 1';
        const prodResult = await pool.query(prodQuery, [id]);

        if (!prodResult.rows[0]) {
            return;
        }

        const query = `UPDATE inventory SET shelf_qty = shelf_qty ${op} $1 WHERE id = $2 RETURNING *`;
        const result = await pool.query(query, [shelf_qty, id]);

        const increasedInventory = Invetory.fromRow(result.rows[0]);
        const type = op === '+' ? 'INVENTORY_INCREASED' : 'INVENTORY_DECREASED';

        publishEvent({
            type: type,
            payload: {
                plu: prodResult.rows[0].plu,
                shop_id: increasedInventory.shopId,
            }
        })

        return increasedInventory;
    } catch (error) {
        console.error('Error updating inventory:', error);
        throw error;
    }
}

export const getInventory = async (filters) => {
    try {
        let query = '';
        const values = [];

        if (filters.plu) {
            values.push(filters.plu);
            query = 'SELECT i.*, p.plu FROM inventory i LEFT JOIN products p  ON  i.prod_id = p.id WHERE 1 = 1 AND plu = $' + (values.length);
        } else {
            query = 'SELECT * FROM inventory WHERE 1 = 1';
        }

        if (filters.shop_id) {
            values.push(filters.shop_id);
            query += ' AND shop_id = $' + (values.length);
        }

        if (filters.shelf_min) {
            values.push(filters.shelf_min);
            query += ' AND shelf_qty >= $' + (values.length);
        }

        if (filters.shelf_max) {
            values.push(filters.shelf_max);
            query += ' AND shelf_qty <= $' + (values.length);
        }

        if (filters.order_min) {
            values.push(filters.order_min);
            query += ' AND order_qty >= $' + (values.length);
        }

        if (filters.order_max) {
            values.push(filters.order_max);
            query += ' AND order_qty <= $' + (values.length);
        }

        const result = await pool.query(query, values);
        const inventory = result.rows.map(row => Invetory.fromRow(row));

        publishEvent({
            type: 'INVENTORY_RECEIVED',
            payload: {
                inventory: inventory.map(inventory => ({
                    plu: inventory.productId,
                    shop_id: inventory.shopId,
                }))
            }
        })

        return inventory;
    } catch (error) {
        console.error('Error fetching inventory:', error);
        throw error;
    }
}
