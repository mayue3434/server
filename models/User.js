const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    googleID: String,
    googleProfile: Schema.Types.Mixed
});

mongoose.model('users', userSchema);