import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
	email: String,
	password: String
})

export default mongoose.model('User', userSchema)