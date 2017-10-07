const passport      = require('passport');
const User          = require('../user/user.model');
const config        = require('./secret');
const JwtStrategy   = require('passport-jwt').Strategy;
const ExtractJwt    = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
 
const localOptions = {
    usernameField: 'email'
};
 
let localLogin = new LocalStrategy(localOptions, function(email, password, done){
    
    User.findOne({email: email})
    .then(user=>{
        if(!user)
            return done(null, false, {error: 'Login failed. Please try again.'});
        user.comparePassword(password)
        .then(isMatch=>{
            if(!isMatch)
                return done(null, false, {error: 'Login failed. Please try again.'});
            return done(null, user);
        }).catch(err=>{
            return done(err);
        });
    });
 
});
 
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.secret
};
 
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){

    User.findById(payload._id)
    .then(user=>{
        if(user)
            done(null, user);
        else
            done(null, false);       
    }).catch(err=>{
        return done(err, false);
    })

});
 
passport.use(jwtLogin);
passport.use(localLogin);