const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);
//get admin product page
router.get('/products', adminController.getProducts);
// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);
//admin edit products
router.get('/edit-product/:productId', adminController.getEditProduct);
//send changes
router.post('/edit-product', adminController.postEditProduct);
//remove product from cart
router.post('/delete-product', adminController.postDeleteProduct);
module.exports = router;
