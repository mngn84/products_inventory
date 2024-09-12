import * as productsService from '../services/productsService.js';

export const createProduct = async (req, res) => {
    try {
        const newProduct = await productsService.createProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
        throw error;
    }
}

export const getProducts = async (req, res) => {
    try {
        const products = await productsService.getProducts(req.query);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
        throw error;
    }
}
