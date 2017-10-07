const express  =   require('express');
const router   =   express.Router();

const passport = require('passport');

const controller = require('./occurrences.controller');

const requireAuth = passport.authenticate('jwt', {session: false}),
      requireLogin = passport.authenticate('local', {session: false});


router.get('/v1/occurrences', controller.getOccurrences);

router.get('/v1/stastistics', controller.getStatistics);

/*
    Data example format to send through the body
    {
        "userToken":{
	        _id : it will be the same user ID
	        "token":"token1 adfsdf",
	        "uuid" : 7.0
	    }
    }
*/ 

//router.put('/v1/occurrences/:id', controller.putUserToken);
      
module.exports = router;