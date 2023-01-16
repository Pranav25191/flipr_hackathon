const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: { type: String, index: true },
    hash_password: {type: String}
}
);

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.hash_password);
};

const usermodel = mongoose.model('User', userSchema);
module.exports = {usermodel};