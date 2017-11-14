import mongoose from 'mongoose'
// const Schema = mongoose.Schema
const isEmail = require('validator/lib/isEmail');

const {
	createToken,
	verifyToken,
	encryptPassword,
	comparePassword
  } = require('./utils/auth');

import Channel from './models/Channel'
import User from './models/User'

const connector = {
	Auth: {
		signIn(args) {
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

						if (user.password == args.password ) {
							return resolve(createToken({ id: user._id, email: user.email }));
						} else {
								return reject({
									code: 'password.wrong',
									message: 'Wrong password.'
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
	}
}

export default connector 