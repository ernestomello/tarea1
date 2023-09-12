var mongoose = require('mongoose');  
var JuegoSchema = new mongoose.Schema({  
    _id: mongoose.Schema.Types.ObjectId,
    fecha:{type: Date, required: true},
    user_winner: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'}
});

mongoose.model('Juego', UserSchema);
module.exports = mongoose.model('Juego');