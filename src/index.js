const express = require('express');
const app     = express();
const chalk   = require('chalk');
const passport = require('passport');


const occurrences = require('./occurrences/occurrences.routes');



const mongoose =   require('mongoose');

mongoose.Promise = global.Promise;

const db   =   require('../config/db.connect').connect();

//
// mongoose.connect(db.database , (err) => {
// 	console.log("Establishing Connection with the database...");
// 	if (err) {
// 		console.log(chalk.red('✗')+" Connection with database failed!");
// 	}
// 	else{
// 		console.log(chalk.green('✓')+" Connection with the database established...");
// 	}
// });

const requireAuth = passport.authenticate('jwt', {session: false})


const jwt  = require('jsonwebtoken');
const config = require('config');
/*
const origins = [//Allowed origins
	'https://www.qyudelivery.com',
	'https://qyudelivery.com',
	'http://www.qyudelivery.com',
	'http://qyudelivery.com',
	'http://main.admin.qyudelivery.com',
	'https://main.admin.qyudelivery.com',
	'http://www.main.admin.qyudelivery.com',
	'https://www.main.admin.qyudelivery.com',
	'http://admin.demo.qyudelivery.com'
]
app.all('*', (req, res, next)=>{
	//return res.status(503).json({message:'Service Unavailable', code: 503});
	return next(); 
	res.header("X-powered-by", "PHP")
	if(config.util.getEnv('NODE_ENV') === 'test')
            return next();
	if(origins.indexOf(req.headers.origin) === -1){
		if(!req.headers['app-release'])
			return res.status(404).json({message:'Not found', code: 404});
		try{
			const secret = Math.trunc(jwt.decode(req.headers['app-release']).iat/1000)+
			"_messagedurationcloseablemastercontentype";
			const token = jwt.verify(req.headers['app-release'], secret);
		}catch(err){
			//console.log(err);
			return res.status(418).json({message:'Eu sou um bule de chá', code: 418});
		}
	}
	//console.log(req.headers.origin)
	//return res.status(503).json({message:'Unavailable', code: 503});
	return next();
});*/
app.use('/', occurrences);
module.exports = app;