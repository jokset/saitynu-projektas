const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.MONGO_USR}:${process.env.MONGO_PWD}` + 
    `@${process.env.MONGO_HOST}/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`);