import * as historyService from '../services/historyService';
import { Request, Response } from 'express';

export const getHistory = async (req: Request, res: Response) => {
    try {
        const history = await historyService.getHistory(req.query);
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ error: error });
        throw error;
    }
}

export function handleEvent(event: any) {
    try {
        historyService.saveEventToDB(event);
    } catch (error) {
        console.error('Error saving event to DB:', error);
        throw error;
    }
}