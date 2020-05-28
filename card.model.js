const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Card = new Schema({
    session_title: {
        type: String
    },
    
    description: {
        type: String
    }

});

module.exports = mongoose.model('Card', Card);