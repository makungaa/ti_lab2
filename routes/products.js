const express = require('express');
const router = express.Router();
const db = require('../db');

// get liste produktów
router.get('/', (req, res) => {
    db.all(
        'SELECT Id, Name, Price FROM Products',
        [],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            res.json(rows);
        }
    );
});

//dodanie produktu
router.post('/', (req, res) => {
    const { name, price } = req.body;

    if (!name || price === undefined) {
        return res.status(400).json({
            error: 'nazwa i cena są wymagane'
        });
    }

    if (price < 0) {
        return res.status(400).json({
            error: 'cena musi byc >0'
        });
    }

    db.run(
        'INSERT INTO Products(Name, Price) VALUES (?, ?)',
        [name, price],
        function (err) {
            if (err) return res.status(500).json(err);

            res.status(201).json({
                id: this.lastID,
                name,
                price
            });
        }
    );
});

module.exports = router;
