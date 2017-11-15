module.exports = {
	server: {
	  host: '0.0.0.0',
	  port: 4000
	},
	database: {
	  host: 'localhost',
	  port: 27017,
	  name: 'graph'
	},
	auth: {
	  secret: 'super_secret_word', // CHANGE IT!
	  expiresIn: 86400 // expires in 24 hours
	}
  };