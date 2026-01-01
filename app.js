const express = require('express');
const app = express();

app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    next();
});

app.use(express.json());
app.use(express.static('public'));

app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api', require('./routes/orders'));


app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
