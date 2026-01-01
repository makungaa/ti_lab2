const express = require('express');
const router = express.Router();
const db = require('../db');

const cartModule = require('./cart');

//post
router.post('/checkout', (req, res) => {
    const cart = cartModule._cart;

    if (!cart || cart.length === 0) {
        return res.status(400).json({
            error: 'Cart is empty'
        });
    }

    const ids = cart.map(i => i.product_id);
    const placeholders = ids.map(() => '?').join(',');

    const sqlProducts = `
    SELECT Id, Price
    FROM Products
    WHERE Id IN (${placeholders})
  `;

    db.all(sqlProducts, ids, (err, products) => {
        if (err) return res.status(500).json(err);

        const priceMap = {};
        products.forEach(p => {
            priceMap[p.Id] = p.Price;
        });

        db.run(
            'INSERT INTO Orders DEFAULT VALUES',
            function (err) {
                if (err) return res.status(500).json(err);

                const orderId = this.lastID;

                const stmt = db.prepare(
                    'INSERT INTO OrderItems(OrderId, ProductId, Qty, Price) VALUES (?, ?, ?, ?)'
                );

                let total = 0;

                cart.forEach(item => {
                    const price = priceMap[item.product_id];
                    const lineTotal = price * item.qty;
                    total += lineTotal;

                    stmt.run(
                        orderId,
                        item.product_id,
                        item.qty,
                        price
                    );
                });

                stmt.finalize(err => {
                    if (err) return res.status(500).json(err);

                    // 4️⃣ wyczyść koszyk
                    cart.length = 0;

                    res.status(201).json({
                        order_id: orderId,
                        total: Number(total.toFixed(2))
                    });
                });
            }
        );
    });
});

// get wszystkich zamowien
router.get('/orders', (req, res) => {
    const sql = `
    SELECT
      o.Id AS OrderId,
      o.CreatedAt,
      IFNULL(SUM(oi.Qty * oi.Price), 0) AS Total
    FROM Orders o
    LEFT JOIN OrderItems oi ON oi.OrderId = o.Id
    GROUP BY o.Id
    ORDER BY o.Id DESC
  `;

    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});


module.exports = router;
