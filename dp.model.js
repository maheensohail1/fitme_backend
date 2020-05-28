const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let DP = new Schema({
    name: {
        type: String
    },
    duration: {
        type: String
    },
    slevel: {
        type: String
    },
    images: {
        type: Array,
        default: []
    }
    
    
});

module.exports = mongoose.model('DP', DP);