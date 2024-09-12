import * as inventoryService from '../services/inventoryService.js';

export const createInventory = async (req, res) => {
    try {
        const newInventory = await inventoryService.createInventory(req.body);
        if (!newInventory) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(201).json(newInventory);
    } catch (error) {
        res.status(400).json({ error: error.message });
        throw error;
    }
}

export const increaseInventory = async (req, res) => {
    try {
        const updatedInventory = await inventoryService.updatedInventory(req.params.id, req.body, '+');
        if (!updatedInventory) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(updatedInventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
        throw error;
    }
}

export const decreaseInventory = async (req, res) => {
    try {
        const updatedInventory = await inventoryService.updatedInventory(req.params.id, req.body, '-');
        if (!updatedInventory) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(updatedInventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
        throw error;
    }
}

export const getInventory = async (req, res) => {
    try {
        const inventory = await inventoryService.getInventory(req.query);
        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
        throw error;
    }
}

