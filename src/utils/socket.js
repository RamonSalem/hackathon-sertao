const token_services = require('./token_services');

let io;

exports.io = io;
exports.init = (newIO)=>{
	io = newIO;
	io.use((socket, next) => {
		return next();
		//console.log(socket.handshake);
		if(!socket.handshake.query.token)
			return next({message: 'authentication error', code: 403});
		let token = socket.handshake.query.token.replace("JWT ", "");
		let decoded = token_services.verify(token);
		if(!decoded){
		    return next({message: 'authentication error', code: 403});//403??
		}
		return next();
	});
}

exports.getIo = ()=>{
	return io;
}

/*
let token = req.headers.authorization.replace("JWT ", "");
//console.log(token);
let decoded = token_services.verify(token)
if(!decoded)
    next('Invalid token');
if(roles.indexOf(decoded.type)>-1)
    next()
else
    next('Unauthorized');

*/