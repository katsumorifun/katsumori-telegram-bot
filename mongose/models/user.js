import mongoose from 'mongoose';

const userShema = new mongoose.Schema({
    user_id: Number,
    name: String,
    admin: {type: Boolean, default: false},
    subscribe_news: {type: Boolean, default: false},
});


const User = mongoose.model('User', userShema);

export default User