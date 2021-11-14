const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    firstName:String,
    age:Number,
    email:String,
    phone:Number
})
module.exports = mongoose.model('user',UserSchema);