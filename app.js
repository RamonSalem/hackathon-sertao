const express = require('express');
const app = express();

const Ddos = require('ddos')
const logger = require('morgan');
const chalk = require('chalk');
const socket = require('./src/utils/socket');
const config = require('config');

const bodyParser= require('body-parser');
const cookieSession = require('cookie-session');


const cors = require('cors');

var server = require('./src/');

app.use(bodyParser.urlencoded({extended: true}))

app.use(bodyParser.json())

app.use(cookieSession({
  name: 'sessions',
  keys: ['key1', 'key2'],
  maxAge: 20000
}))

app.use(cors());
// app.use(logger('common'));
//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
    var ddos = new Ddos({burst: 15, maxcount:40});//disable for testing
    app.use(ddos.express);
    //use morgan to log at command line
    app.use(logger('combined')); //'combined' outputs the Apache style LOGs
}

let interceptor = require('express-interceptor');

let zlib = require('zlib');
let finalParagraphInterceptor = interceptor((req, res)=>{//compressing responses
  return {
    isInterceptable: ()=>{
      return req.headers.deflated;
    },
    intercept: (body, send)=>{
      if(JSON.parse(body).message)
        return send(body);
      let deflated = zlib.deflateSync(body);
      deflated = deflated.toString('base64');
      console.log(deflated)
      send("\""+deflated+"\"");
    }
  };
});

app.use(finalParagraphInterceptor);

app.use('/',server);

const serverIO = app.listen(process.env.PORT || 3000 ,()=>{
	console.log(chalk.green('✓')+' running on port 3000');
})

module.exports = app; // for testing

const socketIO = require('socket.io');
const io = socketIO(serverIO);
socket.init(io);
