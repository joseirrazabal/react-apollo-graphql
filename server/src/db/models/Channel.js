import mongoose, { Schema } from 'mongoose'

const channelSchema = new Schema({
	name: String,
})

export default mongoose.model('Channel', channelSchema)