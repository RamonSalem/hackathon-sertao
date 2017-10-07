const mongoose = require('mongoose');


const schema = new mongoose.Schema({
	name : {type : String, required : true},
    dataNotificacao : {type : Date},
    sexo : String,
    numResi : String,
    nBairro : String //Adicionar mais campos futuramente, como idade
});

module.exports = mongoose.model('occurrence' , schema);
