// import mongoose from './config.js'
import mongoose from 'mongoose'

const Schema = mongoose.Schema

var channelSchema = new Schema({
  name: String,
})

  /*
let Channel = mongoose.model('Channel', channelSchema)

function addChannel(data) {

  var channel = new Channel(data)

  return new Promise((resolve, reject) => {
    channel.save((err, res) => {
      err ? reject(err) : resolve(res)
    })
  })
}

function findChannel(name) {
  let query = Channel.findOne({ name: name })

  return query.exec().then( result => {
    return result
  })
}

function findChannels() {
      // return Channel.find({}).then((items) => {
      //   return items.map((item) => {
      //     item.id = item._id;
      //     return item;
      //   });
      // });

  let query = Channel.find({})

  return query.exec().then( result => {
    // result.id = result._id
    return result
  })
}
*/

module.exports = mongoose.model('Channel', channelSchema)

// export default { Channel, addChannel, findChannel, findChannels }
