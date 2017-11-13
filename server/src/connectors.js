// import mongoose from './config.js'
import mongoose from 'mongoose'

const Schema = mongoose.Schema

var channelSchema = new Schema({
  name: String,
})

var userSchema = new Schema({
  email: String,
  password: String
})

let Channel = mongoose.model('Channel', channelSchema)
let User = mongoose.model('User', userSchema)

function signIn(args) {
	return new Promise((resolve, reject) => {
	  // Validate the data
	  if (!args.email) {
		return reject({
		  code: 'email.empty',
		  message: 'Email is empty.'
		});
	  } else if (!isEmail(args.email)) {
		return reject({
		  code: 'email.invalid',
		  message: 'You have to provide a valid email.'
		});
	  }

	  if (!args.password) {
		return reject({
		  code: 'password.empty',
		  message: 'You have to provide a password.'
		});
	  }

	  // Find the user
	  return User.findOne({ email: args.email })
		.then((user) => {
		  if (!user) {
			return reject({
			  code: 'user.not_found',
			  message: 'Authentication failed. User not found.'
			});
		  }

		  return comparePassword(user.password, args.password, (err, isMatch) => {
			if (err) { return reject(err); }
			if (!isMatch) {
			  return reject({
				code: 'password.wrong',
				message: 'Wrong password.'
			  });
			}

			return resolve(createToken({ id: user._id, email: user.email }));
		  });
		})
		.catch(err => reject(err));
	});
  }

  /*
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

// module.exports = mongoose.model('Channel', channelSchema)

export default { Channel, User, signIn}
// export default { Channel, addChannel, findChannel, findChannels }
