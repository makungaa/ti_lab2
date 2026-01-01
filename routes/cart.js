const express = require('express');
const router = express.Router();
const db = require('../db');

//obiekt koszyka
let cart = [];

//zawartosc koszyka
router.get('/', (req, res) => {
    res.json(cart);
});

//dodawanie produktu
router.post('/add', (req, res) => {
    const { product_id, qty } = req.body;

    if (!product_id || !qty || qty < 1) {
        return res.status(400).json({
            error: 'product_id i qty >= 1 wymagane'
        });
    }

    db.get(
        'SELECT Id FROM Products WHERE Id = ?',
        [product_id],
        (err, product) => {
            if (err) return res.status(500).json(err);
            if (!product) {
                return res.status(404).json({
                    error: 'produkt nie istnieje'
                });
            }

            const item = cart.find(i => i.product_id === product_id);

            if (item) {
                item.qty += qty;
            } else {
                cart.push({ product_id, qty });
            }

            res.json(cart);
        }
    );
});


//zmiana ilosci
router.patch('/item', (req, res) => {
    const { product_id, qty } = req.body;

    if (!product_id || qty < 1) {
        return res.status(400).json({
            error: 'product_id i qty >= 1 wymagane'
        });
    }

    const item = cart.find(i => i.product_id === product_id);
    if (!item) {
        return res.status(404).json({
            error: 'przedmiot nie znaleziony w koszyku'
        });
    }

    item.qty = qty;
    res.json(cart);
});

//usuniecie z koszyka
router.delete('/item/:product_id', (req, res) => {
    const product_id = Number(req.params.product_id);

    const index = cart.findIndex(i => i.product_id === product_id);
    if (index === -1) {
        return res.status(404).json({
            error: 'przedmiot nie znaleziony w koszyku'
        });
    }

    cart.splice(index, 1);
    res.json(cart);
});

router._cart = cart;

module.exports = router;
