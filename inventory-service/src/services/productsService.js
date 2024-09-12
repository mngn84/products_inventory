import { pool } from '../config/db.js';
import Product from '../models/product.js';
import { publishEvent } from '../utils/rmq.js'

export const createProduct = async (productData) => {
    try {
        const { plu, name } = productData;
        const query = 'INSERT INTO products (plu, name) VALUES ($1, $2) RETURNING *';

        const result = await pool.query(query, [plu, name]);
        const newProduct = Product.fromRow(result.rows[0]);

        publishEvent({
            type: 'PRODUCT_CREATED',
            payload: {
                plu: newProduct.plu
            }
        })
        return newProduct;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}

export const getProducts = async (filters) => {
    try {
        let query = 'SELECT * FROM products WHERE 1 = 1';
        const values = [];

        if (filters.name) {
            values.push(filters.name);
            query += ' AND name ~~* $' + (values.length);
        }

        if (filters.plu) {
            values.push(filters.plu);
            query += ' AND plu = $' + (values.length);
        }

        const result = await pool.query(query, values);
        const products = result.rows.map(row => Product.fromRow(row));

        publishEvent({
            type: 'PRODUCTS_RECEIVED',
            payload: {
                products: products.map(product => ({
                    plu: product.plu,
                }))
            }
        })
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }

}
