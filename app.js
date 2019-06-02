const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
//add middlewares bottom up
//If a route is not found it will return to the home page
//The "/" parameter only indicates that the path starts with "/"
//not that it ends with that

//parses only what we need
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//find the test user
app.use((req, res, next) => {
  User.findByPk('1').then(user =>{
    req.user = user;
    next();
  })
  .catch(err => {
    console.log(err);
  })
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
//Products belong to the users and when a user is deleted any product associated
//with them will also get deleted
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
//Carts belong to many products because of the place holder cart item table
Cart.belongsToMany(Product, {through: CartItem});
//Products belong to many carts because of the cart item place holder table
Product.belongsToMany(Cart, {through: CartItem});
//Every order belongs to a user
Order.belongsTo(User);
//Every user may or may not have more than one order
User.hasMany(Order);
//Orders belong to multiple products through the order item place holder table
Order.belongsToMany(Product, {through: OrderItem});


//syncs the models to the database
sequelize
// .sync({ force: true })
.sync()
.then(result => {
  return User.findByPk(1);
})
.then(user => {
  if(!user){
    return User.create({name: 'Kevin', email:'test@test.com'});
  }
  return user
})
.then(user => {
  user.getCart()
  .then(cart => {
    if (cart){
      return cart
    }
    return user.createCart();
  })
  .catch(err => {
    console.log(err);
  });
})
.then(cart => {
  //this is a function that comes with sequelize
  app.listen(3000);
})
.catch(err => {
  console.log(err);
});
