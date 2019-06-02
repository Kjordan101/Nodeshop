//ALL CARTS BELONG TO ONE USER
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Cart = sequelize.define('cart', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  userId: {
    type: Sequelize.INTEGER,
    unique: true,
    allowNull: false
  }
});

module.exports = Cart;
