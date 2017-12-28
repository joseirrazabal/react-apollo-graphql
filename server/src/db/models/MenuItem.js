import mongoose, { Schema } from 'mongoose'
import gral from '../gral'

mongoose.plugin(gral)

const schema = new Schema({
	name: { type: String, unique: true, required: true },
	title: { type: Boolean, default: false },
	url: String,
	order: Number,
	icon: String,
})

export default mongoose.model('MenuItem', schema)