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
// import kafka from 'kafka-node';
// var Kafka = require('node-rdkafka');
// console.log(kafka.features);
// console.log(kafka.librdkafkaVersion);

// var initializeProducer = function () {
// 	producer = new kafka.Producer({
// 		'client.id': 'kafka',
// 		'metadata.broker.list': 'localhost:9092',
// 		'compression.codec': 'gzip',
// 		'retry.backoff.ms': 200,
// 		'message.send.max.retries': 10,
// 		'socket.keepalive.enable': true,
// 		'queue.buffering.max.messages': 100000,
// 		'queue.buffering.max.ms': 1000,
// 		'batch.num.messages': 1000000,
// 		'dr_cb': true
// 	});

// 	producer.connect({}, function (err) {
// 		if (err) {
// 			console.log(err);
// 			return process.exit(1);
// 		};
// 	});

// 	bindListeners();
// };


/*
var stream = Kafka.Producer.createWriteStream({
	'metadata.broker.list': 'localhost:9092'
}, {}, {
		topic: 'topic-name'
	});

// Writes a message to the stream
var queuedSuccess = stream.write(new Buffer('Awesome 123'));

if (queuedSuccess) {
	console.log('We queued our message!');
} else {
	// Note that this only tells us if the stream's queue is full,
	// it does NOT tell us if the message got to Kafka!  See below...
	console.log('Too many messages in our queue already');
}

stream.on('error', function (err) {
	// Here's where we'll know if something went wrong sending to Kafka
	console.error('Error in our kafka stream');
	console.error(err);
})
*/

/*
var avroSchema = {
	name: 'MyAwesomeType',
	type: 'record',
	fields: [
		{
			name: 'id',
			type: 'string'
		}, {
			name: 'timestamp',
			type: 'double'
		}, {
			name: 'enumField',
			type: {
				name: 'EnumField',
				type: 'enum',
				symbols: ['sym1', 'sym2', 'sym3']
			}
		}]
};

var type = avro.parse(avroSchema);
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
*/


/*
 -----------------------------  producer.js  -----------------------------

 --> Este es el productor que así como está, se puede
 correr desde node -> node producer.js

 var producer = new HighLevelProducer(client);

 producer.on('ready', function() {
 // Create message and encode to Avro buffer
 var messageBuffer = type.toBuffer({
 enumField: 'sym1',
 id: '3e0c63c4-956a-4378-8a6d-2de636d191de',
 timestamp: Date.now()
 });

 // Create a new payload
 var payload = [{
 topic: 'node-test',
 messages: messageBuffer,
 attributes: 1 /!* Use GZip compression for the payload *!/
 }];

 //Send payload to Kafka and log result/error
 producer.send(payload, function(error, result) {
 console.info('Sent payload to Kafka: ', payload);
 if (error) {
 console.error(error);
 } else {
 var formattedResult = result[0]
 console.log('result: ', result)
 }
 });
 });

 producer.on('error', function(error) {
 console.error(error);
 });

 -------------------------------------------------------------------------
 */

/*
var HighLevelConsumer = kafka.HighLevelConsumer;
var Client = kafka.Client;

var client = new Client('localhost:2181');
var topics = [{
	topic: 'node-test'
}];

var options = {
	groupId: 'aaa',
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


mongoose.connect('mongodb://localhost:27017/graph', { useMongoClient: true })

const PORT = 4000;
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