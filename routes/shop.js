const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();
//home page
router.get('/', shopController.getIndex);
//list of all products
router.get('/products', shopController.getProducts);
//get specific product
router.get('/products/:productId', shopController.getProductById);
//cart
router.get('/cart', shopController.getCart);
//posting to Cart
router.post('/cart', shopController.postCart);
//delete items from cart
router.post('/cart-delete-item', shopController.postCartDeleteProduct);
//posting to orders
router.post('/create-order', shopController.postOrder);
//orders route
router.get('/orders', shopController.getOrders);
//checkout
router.get('/checkout', shopController.getCheckout);

module.exports = router;
