const Product = require('../models/product');

//load all products on a page
exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Shop',
      path: '/products'
    })
  })
  .catch(err => {
    console.log(err);
  });
};
//load the details of a product
exports.getProductById = (req, res, next) => {
  const prodId = req.params.productId;
  //finds product by its primary key
  Product.findByPk(prodId)
  .then(product => {
    // console.log(product);
    res.render('shop/product-details', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  })
  .catch(err => {
    console.log(err);
  });
};

//loads all the products at once
exports.getIndex = (req, res, next) => {
  Product.findAll()
  .then(products=> {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Welcome!',
      path: '/'
    })
  })
  .catch(err => {
    console.log(err);
  });
};

exports.getCart = (req, res, next) => {
  req.user
  .getCart()
  .then(cart => {
    return cart.getProducts()
    .then(product => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: product
      });
    })
    .catch(err => {
      console.log(err);
    });
  })
  .catch(err => {
    console.log(err);
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
exports.getOrders = (req, res,next) => {
  req.user.getOrders({include: ['products']})
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })
  .catch(err => {
    console.log(err);
  })
  
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user.getCart()
  .then(cart => {
    fetchedCart = cart;
    //returns all products
    return cart.getProducts();
  })
  .then(products => {
    //creates a new order for the user
    return req.user.createOrder()
    .then(order => {
      order.addProducts(products.map(product => {
        product.orderItem = {quantity: product.cartItem.quantity};
        return product;
      }));
    })
    .catch(err => console.log(err));
  })
  .then(result => {
    return fetchedCart.setProducts(null);
  })
  .then(result =>{
    res.redirect('/orders');
  })
  .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
  .getCart()
  .then(cart => {
    fetchedCart = cart;
    return cart.getProducts({ where: { id: prodId } });
  })
  .then(products => {
    let product;
    if (products.length > 0){
      product = products[0];
  }
    /*
    if you add a product to the cart
    that is already in the cart it should find
    the old qty
    */
    if(product){
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1
      return product;
    }
    return Product.findByPk(prodId);
  })
  .then(product => {
    return fetchedCart.addProduct(product, {
      through: {quantity: newQuantity}
    })
  })
  .then(() => {
    res.redirect('/cart');
  })
  .catch(err => {
    console.log(err);
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
  .getCart()
  .then(cart => {
    return cart.getProducts({where: {id: prodId } });
  }).then(products => {
    const product = products[0];
    return product.cartItem.destroy();
  })
  .then(result => {
    res.redirect('/cart');
  })
  .catch(err => {
    console.log(err);
  })
};
