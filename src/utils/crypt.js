const bcrypt   = require('bcrypt-nodejs');

exports.generateHash = (password, cb)=>{
    const SALT_FACTOR = 5;
 
    bcrypt.genSalt(SALT_FACTOR, function(err, salt){
 
        if(err){
            return cb(err);
        }
 
        bcrypt.hash(password, salt, null, function(err, hash){
 
            if(err){
                return cb(err);
            }
            return cb(null, hash);
 
        });
 
    });
}