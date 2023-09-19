var mongoose = require('mongoose');  
var JuegoSchema = new mongoose.Schema({  
    _id: mongoose.Schema.Types.ObjectId,
    fecha:{type: Date, required: true},
    user_winner: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'},
    puntos: {type: Number, required: true}
});

mongoose.model('Juego', JuegoSchema);
module.exports = mongoose.model('Juego');