var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({ 
  _id: mongoose.Schema.Types.ObjectId, 
  name: {type: String, required: true, max: 100},
  email:{type: String, required: true, max: 100},
  password: {type: String, required: true, max: 100}
});

mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');