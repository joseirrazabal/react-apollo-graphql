import mongoose from 'mongoose'
const Schema = mongoose.Schema

var userSchema = new Schema({
	email: String,
	password: String
})

const User = mongoose.model('User', userSchema)

export default User