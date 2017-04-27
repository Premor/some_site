var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , bodyParser = require('body-parser')
var fs = require('fs');
var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/'+file.fieldname)
  },
  filename: function (req, file, cb) {
    
    fs.readdir('./public/img/'+file.fieldname,function(err,ar_fil){
		if (err)
			next(err);
		else
    	cb(null, ar_fil.length)//+(file.originalname).slice((file.originalname).lastIndexOf('.'))
  })
  }
})

var upload = multer({ storage: storage })

var cookieParser = require('cookie-parser')
var Sequelize = require('sequelize');
var session = require('express-session')
var Store = require('express-sequelize-session')(session.Store)
var jsonfile = require('jsonfile')
var sequelize = new Sequelize('visage_school', 'root', 7303556, {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

var store = new Store(sequelize)

var Admin = sequelize.define('Admins', {
  login: {
    type: Sequelize.STRING,
    field: 'login', // Will result in an attribute that is firstName when user facing but first_name in the database
	unique: true
  },
  password: {
    type: Sequelize.STRING,
	allowNull:false
  },
  SessionId:{type:Sequelize.STRING,unique:true}
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
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});
/*
var cards = sequelize.define('Cards',{
	cardName: {
		type: Sequelize.STRING,
		allowNull:false,
		unique:true
	},
	cardRarity: {
		type: Sequelize.STRING,
		allowNull:false
	},
	cardClass: {
		type: Sequelize.STRING,
		allowNull: false
	},
	cardCost: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	cardImg: {
		type: Sequelize.STRING,
		allowNull: false
	},
	cardRace: {
		type: Sequelize.STRING,
		allowNull: true
	}
}, {timestamps: false})

cards.sync()

cards.findAll().then(function(cards){
	jsonfile.writeFile('tmp/cards.json', cards)
})
*/
User.belongsTo(store.Session, {targetKey: 'sid'});

User.sync();

function login_a(req, done){
	Admin.findOne({where: {login: req.body.log, password: req.body.pass}}).then(function (user){
		if (!user)
			throw new Error ('login failed')
		else{
			store.Session.findOne({where: {sid: req.sessionID}}).then
			(function(session)
				{
				if (!session)
					{user}
				else 
					{user.setSession (session)}
				})
		}
	}).then(function (user){done (null, user)}).catch(function(err){done (err, null)})
}



function login(req, done){
	User.findOne({where: {login: req.body.log, password: req.body.pass}}).then(function (user){
		if (!user)
			throw new Error ('login failed')
		else{
			store.Session.findOne({where: {sid: req.sessionID}}).then
			(function(session)
				{
				if (!session)
					{user}
				else 
					{user.setSession (session)}
				})
		}
	}).then(function (user){done (null, user)}).catch(function(err){done (err, null)})
}

function logout(req, done){
	User.findOne({where:{login: req.session.user}}).then(function (user){
		if (!user)
			throw new Error('logout failed')
		else
			{user.setSession(null)}
	}).then(function(user){done(null, user)}).catch(function(err){done(err, null)})
}

var app = express()
function compile(str, path)	{
	return stylus(str)
		.set('filename', path)
		.set('compress', true)
		.use(nib());
	}
app.set('views', __dirname +'/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
	{ src: __dirname
	, compile: compile
	}
))
app.use(express.static(__dirname + '/public'))
app.use(cookieParser())
app.use(session(
{name: 'sid',
	secret: 'Woooooow',
	store:  store,
	resave: false,
saveUninitialized: true,
cookie:{maxAge: 3600000}}//1 час
))
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.configure('development', function(){
  app.use(express.errorHandler());
  app.locals.pretty = true;
});

/*app.get('/tmp/cards', function(req, res){
	var options = {
    root: __dirname + '/tmp/',
    dotfiles: 'deny',
    headers: {
        'x-sent': true
    }}

	res.sendfile('cards.json', options, function(err){
		if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent: cards');
	}
	})
})
*/
app.post('/login', function(req, res, next){
	login(req, function (err, user) {
		if (err)
			next(err);
		else
			
			{req.session.user = req.body.log
			 res.redirect('/')}
			
	})
})

app.post('/admlogin', function(req, res, next){
	login_a(req, function (err, user) {
		if (err)
			next(err);
		else
			
			{req.session.admin = req.body.log
			 res.redirect('/admin')}
			
	})
})
/*
app.get('/photos',function(req, res, next){
	fs.readdir('./public/img/'+req.body.name_albums,function(err,ar_fil){
		if (err)
			next(err);
		else
			res.render('photos',
			{count: ar_fil.length,
	 		name_albums: req.body.name_albums,
	 		user: req.session.user})

			});
			
	
})*/

app.get('/registration',function(req, res, next){
	res.render('registration', {user: req.session.user})
})

app.get('/about_us',function(req, res, next){
	res.render('about_us', {user: req.session.user})
})



app.get('/gallery/:album',function(req, res, next){
	fs.readdir('./public/img/'+req.params.album,function(err,ar_fil){
		if (err)
			next(err);
		else
			fs.readFile('./public/img/name_albums.json',function(err,data){
				if (err)
					next(err);
				else
					res.render('gallery/photos',
						{count: ar_fil.length, 
						engl_name: req.params.album,
	 					list: JSON.parse(data.toString('utf-8')),
				 		user: req.session.user})
				});
			});
	
})


app.get('/gallery',function(req, res, next){
	fs.readdir('./public/img/main',function(err,ar_fil){
		if (err)
			next(err);
		else
			fs.readFile('./public/img/name_albums.json',function(err,data){
				if (err)
					next(err);
				else
					res.render('gallery',
						{count: ar_fil.length,
	 					list: JSON.parse(data.toString('utf-8')),
				 		user: req.session.user})

			});
			
	
	});
})

app.post('/gallery',function(req, res, next){
	res.redirect('/gallery/'+req.body.album_name)
})

app.get('/perarea',function(req, res, next){
	res.render('perarea', {user: req.session.user})
})

app.get('/price',function(req, res, next){
	res.render('price', {user: req.session.user})
})

app.get('/shedule',function(req, res, next){
	res.render('shedule', {user: req.session.user})
})

app.get('/courses',function(req, res, next){
	res.render('courses', {user: req.session.user})
})


app.get('/contacts',function(req, res, next){
	res.render('contacts', {user: req.session.user})
})
app.get('/admin',function(req, res, next){
	res.render('admin', {user: req.session.admin})
})
app.get('/admlogin',function(req, res, next){
	res.render('admin/functions/admlogin', {user: req.session.admin})
})
app.get('/albumschange',function(req, res, next){
	fs.readdir('./public/img/main',function(err,ar_fil){
		if (err)
			next(err);
		else
			fs.readFile('./public/img/name_albums.json',function(err,data){
				if (err)
					next(err);
				else
					res.render('admin/functions/albumschange',
						{count: ar_fil.length,
	 					list: JSON.parse(data.toString('utf-8')),
				 		user: req.session.admin})

			});
			
	
	});
})

app.post('/albumschange',function(req, res, next){
	res.redirect('/albumschange/'+req.body.album_name)
})

app.get('/albumschange/:album',function(req, res, next){
					res.render('admin/functions/photochange',
						{field: req.params.album,
				 		user: req.session.admin})

	
})
app.post('/albumschange/:album',function(req, res, next){
					upload.single(req.params.album)(req,res,function(err){if (err) next(err);else return});
					res.redirect('/albumschange/'+req.params.album)
			
	
	
})

app.get('/login',function(req, res, next){
	res.render('login', {user: req.session.user})
})

app.get('/logout', function(req, res, next){
	logout(req, function(err){
		if (err)
			next(err)
		else
			{console.log('logout')
			 delete req.session.user
			 req.session.destroy
			 res.redirect('/')
		}
	})
})

app.post('/registration', function(req, res, next){
	User.count({where:{login: req.body.mbphn}}).then(function(user){
		if (user){
			res.render('registration', {user: req.session.user, used: true})
		}
		//else if ((req.body.mbphn=='')||(req.body.pass=='')||(req.body.email=='')){
		//	res.render('registration', {user: req.session.user, invalid: true})
		//}
		else{
			User.create({
				login: req.body.mbphn,
				password: req.body.pass,
				email: req.body.email
			})
			res.redirect('/login')
		}
	})
})


app.get('/', function(req, res){
	fs.readdir('./public/img/main',function(err,ar_fil){
		if (err)
			next(err);
		else
			fs.readFile('./public/img/name_albums.json',function(err,data){
				if (err)
					next(err);
				else
					res.render('index',
						{title: 'Home',
	 					count: ar_fil.length,
	 					list: JSON.parse(data.toString('utf-8')),
				 		user: req.session.user})


			});
			
	
	});

	
})

app.use(function(err, req, res, next){
	if (err.message != 'logout failed')
		{return next(err)}
	res.render('logout_fail')
})


app.use(function(err, req, res, next){
	if (err.message != 'login failed')
		{return next(err)}
	res.render('login', {wrong: true})
})


app.listen(3000)
