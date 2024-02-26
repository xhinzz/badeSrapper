const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id_usuario: String,
    usuario: String,
    serv: String,
    id_serv: String,
    avatar: String,
    badges: [String],
    boost: String,
    premiumSince: String
});

module.exports = mongoose.model('User', userSchema);
