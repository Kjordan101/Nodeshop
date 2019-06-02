const mysql = require('mysql2');
const Sequelize = require('sequelize');

//initiate sequelize with a new instance of the object
const sequelize = new Sequelize('node-complete', 'root', 'serverdev616', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
