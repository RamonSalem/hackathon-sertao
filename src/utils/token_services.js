const jwt = require('jsonwebtoken');
const config = require('../auth/secret');
exports.generateToken = (user)=>{
    return jwt.sign(user, config.secret, {
        expiresIn: 43200  //12h
    });
}

exports.verify = (token)=>{
	try{
    	return jwt.verify(token, config.secret);
	}catch(err){
		return null;
	}
}