const mongoose = require('mongoose');
const config = require('config'); //we load the db location from the JSON files
const chalk = require('chalk');
//db options

function connect() {
    const options = {
        server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
        replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
    };
    mongoose.connect(config.DBHost, options);
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, chalk.red('✗')+" Connection with database failed!"));
    db.once('open', ()=>{
        console.log(chalk.green('✓')+" Connection with the database established...");
        //db.collection('occurrence').find({},(err,data)=>{console.log(data)});
    })
}

function getDb(){
    return mongoose.connection;
}
module.exports = { connect, getDb };
// module.exports = {
//     'database': 'your-bd-access'
// };
