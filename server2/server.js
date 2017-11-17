import express from 'express';
import {
	graphqlExpress,
	graphiqlExpress,
} from 'graphql-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { schema } from './src/schema';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import mongoose from 'mongoose'

// import avro from 'avsc';
import kafka from 'kafka-node';

// var avroSchema = {
// 	name: 'MyAwesomeType',
// 	type: 'record',
// 	fields: [
// 		{
// 			name: 'id',
// 			type: 'string'
// 		}, {
// 			name: 'timestamp',
// 			type: 'double'
// 		}, {
// 			name: 'enumField',
// 			type: {
// 				name: 'EnumField',
// 				type: 'enum',
// 				symbols: ['sym1', 'sym2', 'sym3']
// 			}
// 		}]
// };

// var type = avro.parse(avroSchema);


var HighLevelProducer = kafka.HighLevelProducer;
var KeyedMessage = kafka.KeyedMessage;
var Client = kafka.Client;

var client = new Client('localhost:2181', 'my-client-id', {
	sessionTimeout: 300,
	spinDelay: 100,
	retries: 2
});

// For this demo we just log client errors to the console.
client.on('error', function (error) {
	console.error(error);
});

var producer = new HighLevelProducer(client);



var grpc = require('grpc');

var PROTO_PATH = './helloworld.proto';
var proto = grpc.load(PROTO_PATH)

function sayHello(call, callback) {
	var result = []
	result.push({ _id: "5a0cae787f21fa41607cdd19", id: "5a0cae787f21fa41607cdd19", name: 'micro01', description: 'description' })

	callback(null, { message: JSON.stringify(result) });

	// kafka
	sendKafka(3)
}

var server = new grpc.Server();
server.addService(proto.helloworld.Greeter.service, { sayHello: sayHello });
server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
server.start();


// producer.on('ready', function () {
// 	for (let x = 0; x < 2; x++) {
// 		sendKafka(x)
// 	}
// });

function sendKafka(x) {
	let id = "5a0cae787f21fa31607cd123d19" + x
	var messageBuffer = {
		"channel": "channelAdded",
		"channelAdded": {
			id: id,
			name: "prueba" + x,
			description: 'description'
		}
	};

	// Create a new payload
	var payload = [{
		topic: 'node-test',
		messages: JSON.stringify(messageBuffer),
		attributes: 1 // !* Use GZip compression for the payload *!/
	}];

	producer.send(payload, function (error, result) {
		if (error) console.error(error);
	});
}

producer.on('error', function (error) {
	console.error(error);
});


/*
var HighLevelConsumer = kafka.HighLevelConsumer;
var Client = kafka.Client;

var client = new Client('localhost:2181');
var topics = [{
   topic: 'node-test'
}];

var options = {
   groupId: 'bbb',
   autoCommit: true,
   fetchMaxWaitMs: 1000,
   fetchMaxBytes: 1024 * 1024,
   encoding: 'buffer'
};
var consumer = new HighLevelConsumer(client, topics, options);

consumer.on('message', function (message) {
   if (message.value) {
	   var buf = new Buffer(message.value, 'binary'); // Read string into a buffer.
	   if (buf) {
		   console.log(buf.toString())
	   }
	   // var decodedMessage = type.fromBuffer(buf.slice(0)); // Skip prefix.
	   // console.log(decodedMessage);
   }
});

consumer.on('error', function (err) {
   console.log('error', err);
});

process.on('SIGINT', function () {
   consumer.close(true, function () {
	   process.exit();
   });
});

*/

/*
mongoose.connect('mongodb://localhost:27017/graph', { useMongoClient: true })

const PORT = 4001;
const server = express();

// Puerto original 3000
server.use('*', cors({ origin: 'http://localhost:3000' }));

server.use('/graphql', bodyParser.json(), graphqlExpress({
	schema
}));

server.use('/graphiql', graphiqlExpress({
	endpointURL: '/graphql',
	subscriptionsEndpoint: `ws://localhost:4000/subscriptions`
}));

// We wrap the express server so that we can attach the WebSocket for subscriptions
const ws = createServer(server);

ws.listen(PORT, () => {
	console.log(`GraphQL Server is now running on http://localhost:${PORT}`);

	// Set up the WebSocket for handling GraphQL subscriptions
	new SubscriptionServer({
		execute,
		subscribe,
		schema
	}, {
			server: ws,
			path: '/subscriptions',
		});
});
*/