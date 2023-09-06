var mongoose = require('mongoose');  
var JuegoSchema = new mongoose.Schema({  
    _id: mongoose.Schema.Types.ObjectId,
    juego: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'Juego'},
    user: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'},
    puntos:{type: Number, required: true}
});
mongoose.model('JuegoUser', UserSchema);

module.exports = mongoose.model('JuegoUser');