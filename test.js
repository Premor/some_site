var Sequelize = require('sequelize');
var session = require('express-session')
var Store = require('express-sequelize-session')(session.Store)
var sequelize = new Sequelize('postgres', 'postgres', 1111, {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});
var store = new Store(sequelize)
var Session = sequelize.define('Session', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
	unique: true
  },
  sid:{
  	type: Sequelize.STRING,
  	unique: true
  },
  data:{
  	type: Sequelize.TEXT
  }
  });

var User = sequelize.define('Users', {
  login: {
    type: Sequelize.STRING,
    field: 'login', // Will result in an attribute that is firstName when user facing but first_name in the database
	unique: true
  },
  password: {
    type: Sequelize.STRING,
	allowNull:false
	
  },
  email: {
  	type: Sequelize.STRING,
  	unique: true
  },
  SessionId: {
  	type: Sequelize.STRING,
  	unique: true
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

User.sync()
Session.sync()