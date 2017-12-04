import dotenv from 'dotenv'
// import kafka from 'kafka-node';
import grpc from 'grpc'

dotenv.config({ path: '.env' });

var PROTO_PATH = './channel.proto';
var proto = grpc.load(PROTO_PATH).channel

function getAll(call, callback) {
	console.log(call.request.token)
	var result = []
	result.push({ id: "5a0cae787f21fa41607cdd19", name: 'micro01', description: 'description' })
	result.push({ id: "5a0cae787f31fa41607cdd19", name: 'micro02', description: 'description' })
	callback(null, result);

	// kafka
	sendKafka(3)
}

// GRPC
var server = new grpc.Server();

server.addService(proto.Channel.service, { getAll: getAll });

server.bind(`${process.env.GRPC_HOST}:${process.env.GRPC_PORT}`, grpc.ServerCredentials.createInsecure());
server.start();

// KAFKA
/*
var HighLevelProducer = kafka.HighLevelProducer;
var KeyedMessage = kafka.KeyedMessage;
var Client = kafka.Client;

var client = new Client(`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`, 'my-client-id', {
	sessionTimeout: 300,
	spinDelay: 100,
	retries: 2
});

client.on('error', function (error) {
	console.error(error);
});

var producer = new HighLevelProducer(client);

producer.on('ready', function () {
	for (let x = 0; x < 2; x++) {
		sendKafka(x)
	}
});

producer.on('error', function (error) {
	console.error(error);
});

function sendKafka(x) {
	var messageBuffer = {
		"channel": "channelAdded",
		"channelAdded": {
			id: "5a3cae787f21fa31607cd123d19" + x,
			name: "prueba" + x,
			description: 'description'
		}
	};

	// Create a new payload
	var payload = [{
		topic: process.env.KAFKA_TOPIC,
		messages: JSON.stringify(messageBuffer),
		attributes: 1 // !* Use GZip compression for the payload *!/
	}];

	producer.send(payload, function (error, result) {
		if (error) console.error(error);
	});
}
*/


import Kafka from 'node-rdkafka'

var producer = new Kafka.Producer({
	'metadata.broker.list': `${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`,
	'dr_cb': true
});

// Connect to the broker manually
producer.connect();

// Wait for the ready event before proceeding
/*
producer.on('ready', function () {
	try {
		producer.produce(
			// Topic to send the message to
			'topic-test',
			// optionally we can manually specify a partition for the message
			// this defaults to -1 - which will use librdkafka's default partitioner (consistent random for keyed messages, random for unkeyed messages)
			null,
			// Message to send. Must be a buffer

			new Buffer('Awesome message'),
			// for keyed messages, we also specify the key - note that this field is optional
			'Stormwind',
			// you can send a timestamp here. If your broker version supports it,
			// it will get added. Otherwise, we default to 0
			Date.now(),
			// you can send an opaque token here, which gets passed along
			// to your delivery reports
		);
	} catch (err) {
		console.error('A problem occurred when sending our message');
		console.error(err);
	}
});
*/

// Any errors we encounter, including connection errors
producer.on('event.error', function (err) {
	console.error('Error from producer');
	console.error(err);
})

function sendKafka(x) {
	var messageBuffer = {
		"channel": "channelAdded",
		"channelAdded": {
			id: "5a3cae787f21fa31607cd123d19" + x,
			name: "prueba" + x,
			description: 'description'
		}
	};

	producer.produce(
		'topic-test',
		null,
		new Buffer(JSON.stringify(messageBuffer)),
		// for keyed messages, we also specify the key - note that this field is optional
		'Stormwind',
		// you can send a timestamp here. If your broker version supports it,
		// it will get added. Otherwise, we default to 0
		Date.now(),
		// you can send an opaque token here, which gets passed along
		// to your delivery reports
	);
}