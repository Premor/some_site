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
    	cb(null, (ar_fil.length).toString())//+(file.originalname).slice((file.originalname).lastIndexOf('.'))
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
/*

function login_a(req, done){
	User.findOne({where: {login: req.body.log, password: req.body.pass, is_admin:true}}).then(function (user){
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
*/


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
					{user.setSession (session);
					done (null, user);}
				})
		}
	}).catch(function(err){done (err, null)})
}

function logout(req, done){
	User.findOne({where:{login: req.session.user.name}}).then(function (user){
		if (!user)
			throw new Error('logout failed')
		else
		{
			store.Session.findOne({where: {sid: req.sessionID}}).then
			(function(session)
				{
				if (!session)
					{user}
				else 
				{user.setSession(null)}
		})}

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
app.use(express.static(__dirname))
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
			
			{
				if (user.is_admin==false)
					{req.session.user = {'name': req.body.log,'is_admin':false};res.send('suc adm false');}
				else
					{req.session.user = {'name': req.body.log,'is_admin':true};res.send('suc adm true');}
				}
			 //res.redirect('/')}
			
	})
})
/*
app.post('/admlogin', function(req, res, next){
	login_a(req, function (err, user) {
		if (err)
			next(err);
		else
			
			{req.session.user = {'name': req.body.log,'is_admin':true}
			 res.send('sopel')}
			
	})
})*/
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
	if (req.session.user)
		res.render('registration', {user: req.session.user.name})
	else
		res.render('registration')
})

app.get('/about_us',function(req, res, next){
	if (req.session.user)
		res.render('about_us', {user: req.session.user.name})
	else
		res.render('about_us')
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
					if (req.session.user)
						res.render('gallery/photos',
						{count: ar_fil.length, 
						engl_name: req.params.album,
	 					list: JSON.parse(data.toString('utf-8')),
				 		user: req.session.user.name})
					else
					res.render('gallery/photos',
						{count: ar_fil.length, 
						engl_name: req.params.album,
	 					list: JSON.parse(data.toString('utf-8'))
	 				})
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
					if (req.session.user)
						res.render('gallery',
							{count: ar_fil.length,
		 					list: JSON.parse(data.toString('utf-8')),
					 		user: req.session.user.name})
					else
						res.render('gallery',
							{count: ar_fil.length,
		 					list: JSON.parse(data.toString('utf-8')),
					 		})
			});
			
	
	});
})

app.post('/gallery',function(req, res, next){
	res.redirect('/gallery/'+req.body.album_name)
})

app.get('/perarea',function(req, res, next){
	if (req.session.user)
		res.render('perarea', {user: req.session.user.name})
	else
		res.render('perarea')
})

app.get('/mycourses',function(req, res, next){
	if (req.session.user)
		res.render('perarea/mycourses', {user: req.session.user.name})
	else
		res.render('perarea/mycourses')//поменять на переход к регистрации
})

app.get('/price',function(req, res, next){
	if (req.session.user)
		res.render('price', {user: req.session.user.name})
	else
		res.render('price')
})

app.get('/shedule',function(req, res, next){
	if (req.session.user)
		res.render('shedule', {user: req.session.user.name})
	else
		res.render('shedule')
})

app.get('/courses',function(req, res, next){
	fs.readFile('./public/img/courses.json',function(err,data){
				if (err)
					next(err);
				else
					if (req.session.user)
						res.render('courses',
						{
							user: req.session.user.name,
							is_admin: req.session.user.is_admin,
							courses:data.toString('utf-8')})
					else
						res.render('courses',{courses:data.toString('utf-8')})
})
})
app.post('/courses',function(req, res, next){
	res.redirect('/courses/'+req.body.course_name)
})

app.get('/courses/:selected',function(req, res, next){
	fs.readFile('./public/img/courses.json',function(err,data){
				if (err)
					next(err);
				else
					if (req.session.user)
						res.render('courses/selected',
						{
							user: req.session.user.name,
							is_admin: req.session.user.is_admin,
							courses:data.toString('utf-8'),
							selected_name:req.params.selected})
					else
						res.render('courses/selected',{courses:data.toString('utf-8'),selected_name:req.params.selected})
})
})

app.get('/contacts',function(req, res, next){
	if (req.session.user)
		res.render('contacts', {user: req.session.user.name})
	else
		res.render('contacts')
})
app.get('/admin',function(req, res, next){
	if (req.session.user)
		res.render('admin', {user: req.session.user.name,is_admin: req.session.user.is_admin})
	else
		res.render('admin')
})
/*
app.get('/admlogin',function(req, res, next){
	if (req.session.user)
		res.render('admin/functions/admlogin', {user: req.session.user.name})
	else
		res.render('admin/functions/admlogin')
})*/
app.get('/albumschange',function(req, res, next){
	fs.readdir('./public/img/main',function(err,ar_fil){
		if (err)
			next(err);
		else
			fs.readFile('./public/img/name_albums.json',function(err,data){
				if (err)
					next(err);
				else
					if (req.session.user)
						res.render('admin/functions/albumschange',
						{count: ar_fil.length,
		 				list: JSON.parse(data.toString('utf-8')),
					 	user: req.session.user.name,
					 	is_admin: req.session.user.is_admin})
					else
						res.render('admin/functions/albumschange',
						{count: ar_fil.length,
		 				list: JSON.parse(data.toString('utf-8'))
		 			})

		})	
	});
})



app.delete('/albumschange',function(req, res, next){
	fs.readFile('./public/img/name_albums.json',function(err,data){
				if (err)
					console.log("SYKA");
				else
				{

					var buf = JSON.parse(data.toString('utf-8'));
					var i=buf.english.indexOf(req.body.name);
					if (i == (-1))
						res.send('pidaras');
					else{
						var len=buf.english.length;
						buf.english.splice(i,1);
						buf.russian.splice(i,1);
						fs.unlink('./public/img/main/'+i,function(err){
						i=i-(-1);
						while(i<len){
							fs.rename('./public/img/main/'+i,'./public/img/main/'+(i-1),function(err){if (err) console.log("SYKA");;return})//{WARNING}наверно можно использовать синхронный ренайм т.к. при асинхронном все равно придется ждать завершения всех ренеймов
							i++;
						}	
						
					
					fs.writeFile('./public/img/name_albums.json',JSON.stringify(buf),function(err,data){
						if (err) console.log(err);
						else{ 

							var	exec = require('child_process').exec;
							exec('rm -rf ./public/img/'+ req.body.name, function (error, stdout, stderr)  {
  							if (error) {
    							console.log('exec error: '+error);
    							return;
  								}	
						res.send('pisos')
})}
	});})
	}}
	});	
});

app.post('/albumschange',function(req, res, next){
	upload.single('main')(req,res,function(err){if (err) next(err);
		else 
			if (req.body.new_album_ru && req.body.new_album_en)
		{fs.mkdir('./public/img/'+req.body.new_album_en,function(err,next){//?
			if (err) next(err);
			else
				fs.readFile('./public/img/name_albums.json',function(err,data){
				if (err)
					next(err);
				else
					var buf = JSON.parse(data.toString('utf-8'));
					buf.russian.push(req.body.new_album_ru)
					buf.english.push(req.body.new_album_en)
					fs.writeFile('./public/img/name_albums.json',JSON.stringify(buf),function(err,data){
						if (err) console.log(err);
						else 
							res.send('suc')
					})
			})
			})

		}
		else
			res.send('verify')});	
})

app.get('/courseschange',function(req, res, next){
	fs.readFile('./public/img/courses.json',function(err,data){
				if (err)
					next(err);
				else
					if (req.session.user)
						res.render('admin/functions/courseschange',
						{
							user: req.session.user.name,
							is_admin: req.session.user.is_admin,
							courses:data.toString('utf-8')})
					else
						res.render('admin/functions/courseschange',{courses:data.toString('utf-8')})
})
})

app.post('/courseschange',function(req, res, next){
	fs.readFile('./public/img/courses.json',function(err,data){
				if (err)
					next(err);
				else
					var buf=JSON.parse(data.toString('utf-8'))
					buf.push(
						{name:{'english':req.body.eng_name,'russian':req.body.rus_name},
						"briefing_desc":req.body.briefing,
						"price":req.body.price,
						"program": req.body.program})
					fs.writeFile('./public/img/courses.json',JSON.stringify(buf),function(err,data){
						if (err) console.log(err);
						else
						res.send('suc')
})
})
})

app.get('/courseschange/:selected',function(req, res, next){
	fs.readFile('./public/img/courses.json',function(err,data){
				if (err)
					next(err);
				else
					if (req.session.user)
						res.render('admin/functions/selectedchange',
						{
							user: req.session.user.name,
							is_admin: req.session.user.is_admin,
							courses:data.toString('utf-8'),
							selected_name:req.params.selected})
					else
						res.render('admin/functions/selectedchange',{courses:data.toString('utf-8'),selected_name:req.params.selected})
})
})

app.delete('/courseschange',function(req, res, next){
	fs.readFile('./public/img/courses.json',function(err,data_1){
				if (err)
					next(err);
				else
					var buf= JSON.parse(data_1.toString('utf-8'))
					buf.splice(req.body.number,1)
					fs.writeFile('./public/img/courses.json',JSON.stringify(buf),function(err,data){
						if (err) console.log(err);
						else
							res.send('suc')
})
})
})

app.get('/albumschange/:album',function(req, res, next){
	fs.readdir('./public/img/'+req.params.album,function(err,ar_fil){
		if (err)
			next(err);
		else
			fs.readFile('./public/img/name_albums.json',function(err,data){
				if (err)
					next(err);
				else
					if (req.session.user)
						res.render('admin/functions/photochange',
							{count: ar_fil.length, 
							engl_name: req.params.album,
		 					list: JSON.parse(data.toString('utf-8')),
					 		user: req.session.user.name,
					 		is_admin: req.session.user.is_admin})
					else
						res.render('admin/functions/photochange',
							{count: ar_fil.length, 
							engl_name: req.params.album,
		 					list: JSON.parse(data.toString('utf-8'))
		 				})
				});
			});
	
})
app.post('/albumschange/:album',function(req, res, next){
					upload.array(req.params.album)(req,res,function(err){if (err) next(err);else return});
					res.redirect('/albumschange/'+req.params.album)
			
	
	
})
app.delete('/albumschange/:album',function(req, res, next){
					fs.unlink('./public/img/'+req.params.album+'/'+req.body.photo_num,function(){
						var i=req.body.photo_num-(-1);
						while(i<req.body.count){
							fs.rename('./public/img/'+req.params.album+'/'+i,'./public/img/'+req.params.album+'/'+(i-1),function(err){if (err) next(err);return})//{WARNING}наверно можно использовать синхронный ренайм т.к. при асинхронном все равно придется ждать завершения всех ренеймов
							i++;
						}	
						
				})
			
	
	
})
app.get('/login',function(req, res, next){
	if (req.session.user)
		res.render('login', {user: req.session.user.name})
	else
		res.render('login')
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
			res.render('registration', { used: true})
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
					if (req.session.user)
						res.render('index',
							{title: 'Home',
		 					count: ar_fil.length,
		 					list: JSON.parse(data.toString('utf-8')),
					 		user: req.session.user.name})
					else
						res.render('index',
							{title: 'Home',
		 					count: ar_fil.length,
		 					list: JSON.parse(data.toString('utf-8'))
		 				})
			});
			
	
	});

	
})

app.use(function(err, req, res, next){
	if (err.message != 'logout failed')
		{return next(err)}
	res.send('logout_fail')
})


app.use(function(err, req, res, next){
	if (err.message != 'login failed')
		{return next(err)}
	res.render('login', {wrong: true})
})


app.listen(3000)
