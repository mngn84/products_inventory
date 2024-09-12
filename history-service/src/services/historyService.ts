import { QueryResult } from 'pg';
import { History } from '../models/history';
import { pool } from '../config/db';
import { HistoryFilters, HistoryEvent } from '../interfaces/interfaces';


export const getHistory = async (filters: HistoryFilters) => {
    try {
        let query = 'SELECT * FROM history WHERE 1=1';
        const values: string[] = [];

        if (filters.shop_id) {
            values.push(filters.shop_id.toString());
            query += ` AND shop_id = $${values.length}`;
        }

        if (filters.plu) {
            values.push(filters.plu.toString());
            query += ` AND plu = $${values.length}`;
        }

        if (filters.start_date) {
            values.push(filters.start_date.toString());
            query += ` AND date >= $${values.length}`;
        }

        if (filters.end_date) {
            values.push(filters.end_date.toString());
            query += ` AND date <= $${values.length}`;
        }

        if (filters.action) {
            values.push(filters.action);
            query += ` AND action = $${values.length}`;
        }

        const limit: number = filters.limit || 10;
        const offset: number = (filters.offset || 0) * limit;

        values.push(limit.toString(), offset.toString());
        query += ` ORDER BY date DESC LIMIT $${values.length - 1} OFFSET $${values.length} `;

        const result: QueryResult = await pool.query(query, values);

        return {
            items: result.rows.map(row => new History(
                row.shopId,
                row.plu,
                row.date,
                row.action,
            )),
            page: filters.offset ? filters.offset * 1 + 1 : 1,
            pageSize: limit,
        }

    } catch (error) {
        console.error('Error fetching history:', error);
        throw error;
    }
};

export const saveEventToDB = async (event: HistoryEvent) => {
    try {
        const action = event.type;
        const { plu, shop_id } = event.payload;

        const query = 'INSERT INTO history (shop_id, plu, action) VALUES ($1, $2,  $3)';

        await pool.query(query, [shop_id, plu, action]);
    } catch (error) {
        console.error('Error saving event to database:', error);
        throw error;
    }
}