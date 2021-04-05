const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'food_management',
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});

app.listen(3000, () => console.log('Express server is running at port no : 3000'));


//fetch all product according to vendor
app.get('/products', (req, res) => {
    mysqlConnection.query('SELECT * FROM product JOIN vendorcatelog ON product.PRODUCT_ID = vendorcatelog.PRODUCT_ID', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//fetch food products according to product category
app.get('/products/:category', (req, res) => {
    mysqlConnection.query('SELECT * FROM product WHERE PRODUCT_CATEGORY = ?', [req.params.category], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//fetch products according to product discount
app.get('/product/:discount', (req, res) => {
    mysqlConnection.query('select * from vendorcatelog join product on vendorcatelog.product_id = product.product_id where vendorcatelog.discount_per_product= ?', [req.params.discount], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

// add product to the cart
app.post('/addTocart', (req, res) => {
    const params = req.body
    mysqlConnection.query('INSERT INTO cart SET ?', params, (err, rows, fields) => {
        if (!err)
            res.send("Product has been added.");
        else
            console.log(err);
    })
});

// add product to the the vendor catelog
app.post('/addProduct', (req, res) => {
    const params = req.body
    console.log(params);
    mysqlConnection.query('INSERT INTO vendorcatelog SET ?', params, (err, rows, fields) => {
        if (!err)
            res.send("Vendor has beed added product in VendorCatalog table.");
        else
            console.log(err);
    })
});

//Vendor update his catalog
app.put('/updateCatelog', (req, res) => {
    var discount = req.body.DISCOUNT_PER_PRODUCT;
    var id = req.body.VENDOR_ID;
    mysqlConnection.query('UPDATE vendorcatelog SET DISCOUNT_PER_PRODUCT = ? WHERE VENDOR_ID = ?', [discount,id], (err, rows, fields) => {
        if (!err)
            res.send("Vendor Updated Catelog Successfully!");
        else
            console.log(err);
    })
});

//Delete a product
app.delete('/delete/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM vendorcatelog WHERE PRODUCT_ID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});