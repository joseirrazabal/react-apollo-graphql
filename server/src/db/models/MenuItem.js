import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
	title: { type: String, unique: true, required: true },
	route: String,
	order: Number,
})

export default mongoose.model('MenuItem', schema)