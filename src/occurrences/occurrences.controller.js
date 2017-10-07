const occurrences = require('./occurrences.dba');

exports.getOccurrences = async (req, res)=>{
    


    try{
        const disease = req.query.disease;
        const district = req.query.district; 
        const year = req.query.year;        
        console.log(disease);
        const data = await occurrences.getOccurrences(disease, district, year);
        //console.log(data);
        return res.json(data);
    }catch(err){
        return res.json(err);
    }

}

exports.getStatistics = async (req, res)=>{
    
    try{
        const disease = req.query.disease; 
        //const year = req.query.year;        
        //console.log(disease);
        const data = await occurrences.getStatistics(disease);
        //console.log(data);
        return res.json(data);
    }catch(err){
        return res.json(err);
    }

}
