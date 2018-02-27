var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , bodyParser = require('body-parser')
var fs = require('fs');
var FileReader= require('./file-reader');
var FR = new FileReader();
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
		fs.readFile('./public/img/encoding.json',function(err,data){
			if (err)
				next(err);
			else
				
				var buf = JSON.parse(data.toString('utf-8'))
				if (file.fieldname != 'main'){
				var i=0
				for(i=0;i<buf.length;i++)
				{
					if (buf[i].album_name == file.fieldname)
						break

				}
				buf[i].encoding.push((file.originalname).slice((file.originalname).lastIndexOf('.')+1))
				}
				else
				{
					buf.push({"album_name":req.body.new_album_en,"main_enc":(file.originalname).slice((file.originalname).lastIndexOf('.')+1),"encoding":[]})
				}
				fs.writeFile('./public/img/encoding.json',JSON.stringify(buf),function(err,data){if (err) next(err);
				})
				
			})
    	cb(null, (ar_fil.length).toString()+(file.originalname).slice((file.originalname).lastIndexOf('.')))//+(file.originalname).slice((file.originalname).lastIndexOf('.'))
  })
  }
})
//
var readline = require('readline');
var google = require('googleapis').google;

var googleAuth = require('google-auth-library');
//console.log(google)
// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';
//

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
  },
  is_admin:{
  	type: Sequelize.BOOLEAN
  },
  id_videos:{
  	type: Sequelize.ARRAY(Sequelize.INTEGER)
  },
  phone:{
	type: Sequelize.STRING
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
					{req.session.user = {'name': req.body.log,'is_admin':false,'id':req.sessionID};res.send('suc adm false');}
				else
					{req.session.user = {'name': req.body.log,'is_admin':true,'id':req.sessionID};res.send('suc adm true');}
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
					fs.readFile('./public/img/encoding.json',function(err,enc){
						if (err)
							next(err);
						else
							if (req.session.user)
								res.render('gallery/photos',
								{count: ar_fil.length, 
								engl_name: req.params.album,
	 							list: JSON.parse(data.toString('utf-8')),
								encoding: JSON.parse(enc.toString('utf-8')), 
								user: req.session.user.name})
							else
							res.render('gallery/photos',
								{count: ar_fil.length, 
								engl_name: req.params.album,
								encoding: JSON.parse(enc.toString('utf-8')), 
								list: JSON.parse(data.toString('utf-8'))
							 })
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
					fs.readFile('./public/img/encoding.json',function(err,enc){
						if (err)
							next(err);
						else
							if (req.session.user)
								res.render('gallery',
									{count: ar_fil.length,
									 list: JSON.parse(data.toString('utf-8')),
									 encoding: JSON.parse(enc.toString('utf-8')),
							 		 user: req.session.user.name})
							else
								res.render('gallery',
									{count: ar_fil.length,
									 encoding: JSON.parse(enc.toString('utf-8')),
		 							 list: JSON.parse(data.toString('utf-8'))
									 })
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

app.get('/changedata',function(req, res, next){
	if (req.session.user)
		res.render('perarea/changedata', {user: req.session.user.name})
	else
		res.render('perarea/changedata')
})

app.get('/changepassword',function(req, res, next){
	if (req.session.user)
		res.render('perarea/changepassword', {user: req.session.user.name})
	else
		res.render('perarea/changepassword')
})

app.get('/newpass_check',function(req, res, next){
	if (req.session.user)
		res.render('perarea/newpass_check', {user: req.session.user.name})
	else
		res.render('perarea/newpass_check')
})

app.get('/price',function(req, res, next){
	if (req.session.user)
		res.render('price', {user: req.session.user.name})
	else
		res.render('price')
})

app.get('/shedule',function(req, res, next){
			// Load client secrets from a local file.
		fs.readFile('client_secret.json', function processClientSecrets(err, content) {
			if (err) {
			next('Error loading client secret file: ' + err);
			
			}
			else{
			// Authorize a client with the loaded credentials, then call the
			// Google Sheets API.
			authorize(JSON.parse(content), listMajors,req,res,next);
			}
		});
})

app.get('/courses',function(req, res, next){
	fs.readFile('./public/img/courses.json',function(err,data){
	//FR.readJSON(__dirname+'/public/img/courses.json',function(err,data){
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
		if (req.session.user.id==req.sessionID){
			console.log(req.session.user.name+"		"+req.session.user.is_admin)
			res.render('admin', {user: req.session.user.name,is_admin: req.session.user.is_admin})
		}
		else
			res.render('admin')
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
				fs.readFile('./public/img/encoding.json',function(err,enc){
					if (err)
						next(err);
					else
						if (req.session.user)
							res.render('admin/functions/albumschange',
							{count: ar_fil.length,
							list: JSON.parse(data.toString('utf-8')),
							encoding: JSON.parse(enc.toString('utf-8')),
						 	user: req.session.user.name,
						 	is_admin: req.session.user.is_admin})
						else
							res.render('admin/functions/albumschange',
							{count: ar_fil.length,
							encoding: JSON.parse(enc.toString('utf-8')),
		 					list: JSON.parse(data.toString('utf-8'))
		 				})
				})
		})	
	});
})



app.delete('/albumschange',function(req, res, next){
	fs.readFile('./public/img/name_albums.json',function(err,data){
				if (err)
					{console.log("SYKA");next(err)}
				else
				{
				fs.readFile('./public/img/encoding.json',function(err,enc){
					if (err)
						{console.log("SYKA");next(err)}
					else
					{
					var encoding = JSON.parse(enc.toString('utf-8'));
					var buf = JSON.parse(data.toString('utf-8'));
					var i=buf.english.indexOf(req.body.name);
					if (i == (-1))
						res.send('pidaras');
					else{
						var len=buf.english.length;
						buf.english.splice(i,1);
						buf.russian.splice(i,1);
						fs.unlink('./public/img/main/'+i+'.'+encoding[i].main_enc,function(err){
						if (err) {next(err);}
						else{
							
						i=i-(-1);
						while(i<len){
							fs.rename('./public/img/main/'+i+'.'+encoding[i].main_enc,'./public/img/main/'+(i-1)+'.'+encoding[i].main_enc,function(err){if (err) console.log("SYKA");next(err)})//{WARNING}наверно можно использовать синхронный ренайм т.к. при асинхронном все равно придется ждать завершения всех ренеймов
							i++;
						}	
						encoding.splice(i-1,1);
					
					fs.writeFile('./public/img/name_albums.json',JSON.stringify(buf),function(err,data){
						if (err) {console.log(err);next(err);}
						else{
							fs.writeFile('./public/img/encoding.json',JSON.stringify(encoding),function(err,data){
								if (err) {console.log(err);next(err);}
								else{ 
							 
							var	exec = require('child_process').exec;
							exec('rm -rf ./public/img/'+ req.body.name, function (error, stdout, stderr)  {
  							if (error) {
    							console.log('exec error: '+error);
    							next(err);
								  }
						else	
						{res.send('pisos')}
})}})}
	});}})
	}}})}
	});	
});

app.post('/albumschange',function(req, res, next){
	upload.single('main')(req,res,function(err){if (err){console.log(err);next(err);}
	else 
	if (req.body.new_album_ru && req.body.new_album_en)
		{fs.mkdir('./public/img/'+req.body.new_album_en,function(err){//?
			if (err)  {console.log(err);next(err);}
			else
				fs.readFile('./public/img/name_albums.json',function(err,data){
				if (err)
						{ console.log(err);next(err);}	
				else
					fs.readFile('./public/img/encoding.json',function(err,enc){
						var buf = JSON.parse(data.toString('utf-8'));
						var encoding = JSON.parse(enc.toString('utf-8'));
						encoding.push({"album_name":req.body.new_album_en,"encoding":[]})
						buf.russian.push(req.body.new_album_ru)
						buf.english.push(req.body.new_album_en)
						fs.writeFile('./public/img/name_albums.json',JSON.stringify(buf),function(err,data){
							if (err) {console.log(err);next(err);}
							else
									res.send('suc')
							}) 
					
						//})
				
			})
			})
		})
		}
		else
			{console.log(req.body.new_album_ru +"	"+ req.body.new_album_en);
				res.send('verify');}	})
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
					fs.readFile('./public/img/encoding.json',function(err,enc){
						if (err)
							next(err);
						else
							if (req.session.user)
								res.render('admin/functions/photochange',
									{count: ar_fil.length, 
									engl_name: req.params.album,
									list: JSON.parse(data.toString('utf-8')),
									encoding:JSON.parse(enc.toString('utf-8')), 
							 		user: req.session.user.name,
							 		is_admin: req.session.user.is_admin})
							else
								res.render('admin/functions/photochange',
									{count: ar_fil.length, 
									engl_name: req.params.album,
		 							list: JSON.parse(data.toString('utf-8'))
								 })
					})
				});
			});
	
})

app.post('/albumschange/:album',function(req, res, next){
					upload.array(req.params.album)(req,res,function(err){if (err) next(err);else return});
					res.redirect('/albumschange/'+req.params.album)
			
})

app.delete('/albumschange/:album',function(req, res, next){
		console.log(req.params.album);
		console.log(req.params);
		console.log(req.path);

		console.log(req.params.name);

		fs.readFile('./public/img/encoding.json',function(err,enc){
				if (err)
					{next(err);}
				else
					{
					encoding = JSON.parse(enc.toString("utf-8"))
					var j=0
					for(;j<encoding.length;j++)
					{
						if (encoding[j].album_name == req.params.album)
						{break;}
					}
					console.log(j+" < "+encoding.length)
					console.log(encoding[0].album_name +" = "+ req.params.album)
					console.log(encoding[1].album_name +" = "+ req.params.album)
					fs.unlink('./public/img/'+req.params.album+'/'+req.body.photo_num+"."+encoding[j].encoding[req.body.photo_num],function(err){
						if (err) {console.log(err);next(err);}
						else
						{var i=req.body.photo_num-(-1);
						while(i<req.body.count){
							fs.rename('./public/img/'+req.params.album+'/'+i+"."+encoding[j].encoding[i],'./public/img/'+req.params.album+'/'+(i-1)+"."+encoding[j].encoding[i],function(err){if (err) next(err);return})//{WARNING}наверно можно использовать синхронный ренайм т.к. при асинхронном все равно придется ждать завершения всех ренеймов
							i++;
						}	
						encoding[j].encoding.splice(i-1,1);
						fs.writeFile('./public/img/encoding.json',JSON.stringify(encoding),function(err,data){
							if (err) {console.log(err);next(err);}
						})}
				})}
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
	User.count({where:{login: req.body.email}}).then(function(user){
		if (user){
			res.render('registration', { used: true})
		}
		//else if ((req.body.mbphn=='')||(req.body.pass=='')||(req.body.email=='')){
		//	res.render('registration', {user: req.session.user, invalid: true})
		//}
		else{
			User.create({
				login: req.body.email,
				password: req.body.pass,
				email: req.body.email,
				phone: req.body.mbphn
			})
			res.send('suc')
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
				fs.readFile('./public/img/encoding.json',function(err,enc){
					if (err)
						next(err);
					else
						if (req.session.user) 
							if (req.session.user.id==req.sessionID)
								res.render('index',
									{title: 'Home',
		 							count: ar_fil.length,
		 							list: JSON.parse(data.toString('utf-8')),
									encoding: JSON.parse(enc.toString('utf-8')),
									 user: req.session.user.name})
							else
								res.render('index',
									{title: 'Home',
									 count: ar_fil.length,
									 encoding: JSON.parse(enc.toString('utf-8')),
		 							list: JSON.parse(data.toString('utf-8'))
		 						})
						else
							res.render('index',
								{title: 'Home',
								 count: ar_fil.length,
								 encoding: JSON.parse(enc.toString('utf-8')),
		 						list: JSON.parse(data.toString('utf-8'))
		 					})
						});
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


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback,req,res,next) {
	var clientSecret = credentials.installed.client_secret;
	var clientId = credentials.installed.client_id;
	var redirectUrl = credentials.installed.redirect_uris[0];
	var auth = new googleAuth();
	var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
	fs.readFile(TOKEN_PATH, function(err, token) {
		if (err) {
		  getNewToken(oauth2Client, callback,req,res,next);
		} else {
		  oauth2Client.credentials = JSON.parse(token);
		  callback(oauth2Client,req,res,next);
		}
	  });
	}

	/**
	* Get and store new token after prompting for user authorization, and then
	* execute the given callback with the authorized OAuth2 client.
	*
	* @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
	* @param {getEventsCallback} callback The callback to call with the authorized
	*     client.
	*/
   function getNewToken(oauth2Client, callback,req,res,next) {
	 var authUrl = oauth2Client.generateAuthUrl({
	   access_type: 'offline',
	   scope: SCOPES
	 });
	 console.log('Authorize this app by visiting this url: ', authUrl);
	 var rl = readline.createInterface({
	   input: process.stdin,
	   output: process.stdout
	 });
	 rl.question('Enter the code from that page here: ', function(code) {
	   rl.close();
	   oauth2Client.getToken(code, function(err, token) {
		 if (err) {
		   console.log('Error while trying to retrieve access token', err);
		   return;
		 }
		 oauth2Client.credentials = token;
		 storeToken(token);
		 callback(oauth2Client,req,res,next);
	   });
	 });
   }
   
   /**
	* Store token to disk be used in later program executions.
	*
	* @param {Object} token The token to store to disk.
	*/
   function storeToken(token) {
	 try {
	   fs.mkdirSync(TOKEN_DIR);
	 } catch (err) {
	   if (err.code != 'EEXIST') {
		 throw err;
	   }
	 }
	 fs.writeFile(TOKEN_PATH, JSON.stringify(token));
	 console.log('Token stored to ' + TOKEN_PATH);
   }
   
   /**
	* Print the names and majors of students in a sample spreadsheet:
	* https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
	*/
   function listMajors(auth,req,res,next) {
	 var sheets = google.sheets('v4');
	 var Dt=new Date();
  	 var month= '';
  	 switch(Dt.getMonth()){
  	   case(0):{month = 'January' ;break;}
  	   case(1):{month = 'February'; break;}
  	   case(2):{month = 'March';break;}
  	   case(3):{month = 'April';break;}
  	   case(4):{month = 'May';break;}
  	   case(5):{month = 'June';break;}
  	   case(6):{month = 'Jule';break;}
  	   case(7):{month = 'August';break;}
  	   case(8):{month = 'September';break;}
  	   case(9):{month = 'October';break;}
  	   case(10):{month = 'November';break;}
  	   case(11):{month = 'December';break;}
  	   default:{console.log('error month'); month='January';}
  	 }
	 sheets.spreadsheets.values.get({
	   auth: auth,
	   spreadsheetId: '1H0h_AVS5naqA3SmIIIVPn5caSQSXV7_cIBjvTbL0ZBQ',
	   range: month+'!A:H',
	 }, function(err, response) {
	   if (err) {
			next('The API returned an error: ' + err);
	   }
	   else{
	   var rows = response.values;
	   
	   if (rows.length == 0) {
		 next('No data found.');
	   } else {
		 
		 var scheldure = {month:'',monday:['','','','','',''],tuesday:['','','','','',''],wednesday:['','','','','',''],thursday:['','','','','',''],friday:['','','','','',''],saturday:['','','','','',''],sunday:['','','','','',''] }
		 for (var i = 1,g=0; i < rows.length; i+=3,g++) {
		   
		   for (var j=1; j<rows[i].length;j++)
		   {
			 switch(j){
			   case(1):{scheldure.monday[g]={date:rows[i][j],courses:rows[i+1][j],available:true};if (rows[i+2][j]=='свободно') {scheldure.monday[g].available=true}else{scheldure.monday[g].available=false};break}
			   case(2):{scheldure.tuesday[g]={date:rows[i][j],courses:rows[i+1][j],available:true};if (rows[i+2][j]=='свободно') {scheldure.tuesday[g].available=true}else{scheldure.tuesday[g].available=false};break}
			   case(3):{scheldure.wednesday[g]={date:rows[i][j],courses:rows[i+1][j],available:true};if (rows[i+2][j]=='свободно') {scheldure.wednesday[g].available=true}else{scheldure.wednesday[g].available=false};break}
			   case(4):{scheldure.thursday[g]={date:rows[i][j],courses:rows[i+1][j],available:true};if (rows[i+2][j]=='свободно') {scheldure.thursday[g].available=true}else{scheldure.thursday[g].available=false};break}
			   case(5):{scheldure.friday[g]={date:rows[i][j],courses:rows[i+1][j],available:true};if (rows[i+2][j]=='свободно') {scheldure.friday[g].available=true}else{scheldure.friday[g].available=false};break}
			   case(6):{scheldure.saturday[g]={date:rows[i][j],courses:rows[i+1][j],available:true};if (rows[i+2][j]=='свободно') {scheldure.saturday[g].available=true}else{scheldure.saturday[g].available=false};break}
			   case(7):{scheldure.sunday[g]={date:rows[i][j],courses:rows[i+1][j],available:true};if (rows[i+2][j]=='свободно') {scheldure.sunday[g].available=true}else{scheldure.sunday[g].available=false};break}
			   default:console.log("error! Coloumn = "+i+" Row = "+j)
			 } 
		   }
		   
		 }
		 scheldure.month=rows[0][0]
		 //console.log(req)
		 //console.log(req.req)
		 //console.log(req.session)
		 if (req.session.user){
		 	res.render('shedule', {user: req.session.user.name,table: scheldure})}
		 else
			{res.render('shedule',{table:scheldure})}
	   }
	}
	 });
   }
   


app.listen(3000)
