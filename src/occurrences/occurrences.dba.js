const Occurrences = require('./occurrences.model');
//let mongoose = require('mongoose');
//let db = mongoose.connection;

let db = require('../../config/db.connect').getDb();

exports.getOccurrences = (disease, district, year)=>{
    return new Promise((resolve, reject)=>{
        
        db.collection('occurrence').find({name : disease, nBairro : district}).
        toArray((err, data)=>{
            if(data && data.length>0){ 
                return resolve({data : data, code : 200});
            }
            else if(err){
                return reject( {data: err, code : 500, message : 'Error when getting userToken'});
            }else{
                return reject( {data : 'Not found', code : 404, message: 'Could not find disease'});
            }    
        })
    });
}


exports.getStatistics = (disease)=>{
    return new Promise((resolve, reject)=>{
        
        db.collection('occurrence').aggregate(
            {$match : {name : disease}}
        ).
        toArray((err, data)=>{
            if(data && data.length>0){ 
                return resolve({data : data, code : 200});
            }
            else if(err){
                return reject( {data: err, code : 500, message : 'Error when getting userToken'});
            }else{
                return reject( {data : 'Not found', code : 404, message: 'Could not find disease'});
            }    
        })
    });
}
