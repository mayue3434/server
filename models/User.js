const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    username: String,
    password: String,
    googleID: String,
    googleProfile: Schema.Types.Mixed
});

mongoose.model('users', userSchema);