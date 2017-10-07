const jwt  = require('jsonwebtoken');  
const User = require('../user/user.model');
const authConfig = require('./secret');
const token_services = require('../utils/token_services');
const userDba = require('../user/user.dba');

const socket = require('../utils/socket');


const regularExpEmail = new RegExp("[a-z0-9_]+@[a-z0-9]+\\.([a-z0-9]+)+") //email validation
const regularExpPass  = new RegExp(".{5}");//regular expression for password, must contain length 5 min

let generateToken = (user)=>{
    return jwt.sign(user, authConfig.secret, {
        expiresIn: 86400*7//one week
    });
}
 
let setUserInfo = (request)=>{
    return {
        _id: request._id,
        email: request.email,
        name : request.name,
        type : request.type,
        //addresses: request.addresses,
        store_id  : request.store_id
    }
}

exports.login2 = (req, res, next)=>{
 
    let userInfo = setUserInfo(req.user);
 
    res.status(200).json({data: {
            token: 'JWT ' + generateToken(userInfo),
            user: userInfo
        }, code: 200});
 
}

exports.socialMediaLogin = async (req, res)=>{
    let request = { 
        type: req.body.type,
        uuid: req.body.uuid,
        app_id: req.body.app_id,
        signup: req.body.signup
    }

 
    if(!request.uuid  || request.signup == undefined || !request.type )
        return res.status(400).json({message:'Invalid request', code: 400});

    if(request.signup){
        try{
            let custon_user = await userDba.getByUuid(request.uuid);
            //console.log(custon_user);
            if(custon_user.message)
                return res.status(404).json({message: custon_user, code: 404});
            let user;
            if(request.type == 'normal'){
                user = {
                    email: custon_user.data.details.email,
                    name : custon_user.data.details.name,
                    uuid : request.uuid
                }
            }else{
                user = {
                    email: custon_user.data.social[request.type].data.email,
                    name : custon_user.data.social[request.type].data.full_name,
                    uuid : request.uuid
                }
            }
            let result   = await userDba.create(user);
            if(result.code == 409){
                result = await userDba.getByEmail(user.email, {__v: 0, recoverCode: 0});
                userDba.setUuid(user.email, request.uuid);
            }
            if(result.message)
                return res.status(result.code).json(result);
            const userInfo = setUserInfo(result.data);
            socket.getIo().emit('new_user', userInfo);
            return res.status(201).json({
                data:{
                    token: 'JWT ' + generateToken(userInfo),
                    user: userInfo
                }, code: 200
            });
        }catch(err){
            console.log(err);
            return res.status(500).json({message:err.toString(), code: 500});
        }
    }else{
        try{
            let custon_user = await userDba.getByUuid(request.uuid);
            if(custon_user.message){
                //console.log(custon_user);
                return res.status(404).json({message: custon_user.message, code: 404});
            }
            let email = request.type == 'normal'?custon_user.data.details.email:custon_user.data.social[request.type].data.email;
            let user  = await userDba.getByEmail(email, {__v:0, password: 0})
            if(user.message){
                //console.log(user);
                return res.status(user.code).json(user);
            }
            const userInfo = setUserInfo(user.data);
            return res.status(201).json({
                data:{
                    token: 'JWT ' + generateToken(userInfo),
                    user: userInfo
                }, code: 200
            });
        }catch(err){
            console.log(err);
            return res.status(500).json({message:err.toString(), code: 500});
        }
    }
}

exports.login = async (req, res)=>{
    const email    = req.body.email;
    const password = req.body.password;
    if(!email||!regularExpEmail.test(email))
        return res.status(400).json({message:'Invalid email', code: 400});
    else if(!password||!regularExpPass.test(password))
        return res.status(400).json({message: 'Invalid password', code: 400});


    try{
        let result   = await userDba.login(email, password);
        if(result.message)
          return res.status(result.code).json(result);  

        let userInfo = setUserInfo(result.data)
        return res.status(200).json({
            data:{
                token: 'JWT ' + generateToken(userInfo),
                user: userInfo
            }, code: 200
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({message:err, code: 500});
    }
    
}

exports.registerAdmin = async (req, res)=>{
    const user = {
        name    : req.body.name,
        password: req.body.password,
        email   : req.body.email,
        type    : req.params.type,
        store_id : req.body.store_id
    }
    const regularExpName  = new RegExp(".{3}");

    if(!user.email||!regularExpEmail.test(user.email)){
        return res.status(400).json({message:'Invalid email', code: 400});
    }else if(!user.password||!regularExpPass.test(user.password)){
        return res.status(400).json({message: 'Invalid password', code: 400});
    }else if(!user.name|| !regularExpName.test(user.name)){
        return res.status(400).json({message: 'Name is required', code: 400});
    }
    const types = ['admin', 'dev', 'client', 'enduser'];
    if(types.indexOf(user.type) == -1)
        return res.status(400).json({message: 'Invalid type', code: 400});

    try{
        let result = await userDba.create(user);
        if(result.message)
          return res.status(result.code).json(result);  
        const userInfo = setUserInfo(result.data);

        return res.status(201).json({
            data:{
                token: 'JWT ' + generateToken(userInfo),
                user: userInfo
            }, code: 201
        });
        //return res.status(result.code).json(result);
    }catch(err){
        console.log(err);
        return res.status(500).json({message:err, code: 500});
    }
}

exports.register = async (req, res)=>{
    const user = {
        name    : req.body.name,
        password: req.body.password,
        email   : req.body.email,
    }
    const regularExpName  = new RegExp(".{3}");

    if(!user.email||!regularExpEmail.test(user.email)){
        return res.status(400).json({message:'Invalid email', code: 400});
    }else if(!user.password||!regularExpPass.test(user.password)){
        return res.status(400).json({message: 'Invalid password', code: 400});
    }else if(!user.name|| !regularExpName.test(user.name)){
        return res.status(400).json({message: 'Name is required', code: 400});
    }

    try{
        let result = await userDba.create(user);
        if(result.message)
          return res.status(result.code).json(result);  
        const userInfo = setUserInfo(result.data);
        socket.getIo().emit('new_user', userInfo);
        return res.status(201).json({
            data:{
                token: 'JWT ' + generateToken(userInfo),
                user: userInfo
            }, code: 200
        });
        //return res.status(result.code).json(result);
    }catch(err){
        console.log(err);
        return res.status(500).json({message:err, code: 500});
    }
}


const config = require('config');
exports.roleAuthorization = (roles)=>{//['admin', 'dev', 'client', 'enduser']
    return (req, res, next)=>{
        return next();
        if(config.util.getEnv('NODE_ENV') === 'test')
            return next();

        //if((req.headers.origin !== 'http://localhost:4200')&&((roles.length===1)&&(roles[0]==="client")))
        //  return res.status(403).json({message: 'Unauthorized', code: 403});
        roles.push('admin');
        if(!req.headers.authorization)
            return res.status(403).json({message: 'Authorization header is required', code: 403});
        
        let token = req.headers.authorization.replace("JWT ", "");
        let decoded = token_services.verify(token)
        if(!decoded)
            return res.status(403).json({message: 'Invalid token', code: 403});
        else if( (roles.indexOf(decoded.type)>-1) || roles.indexOf('all')>-1){
            req.params.storeId = req.params.storeId?decoded.store_id:undefined;
            req.params.userId  = req.params.userId ?decoded._id:undefined;
            return next();
        }else
            return res.status(403).json({message: 'Unauthorized', code: 403});
    }
}