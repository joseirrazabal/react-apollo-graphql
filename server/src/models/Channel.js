import mongoose from 'mongoose'
const Schema = mongoose.Schema

var channelSchema = new Schema({
	name: String,
})

const Channel = mongoose.model('Channel', channelSchema)

export default Channel 