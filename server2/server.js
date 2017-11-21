import dotenv from 'dotenv'
import kafka from 'kafka-node';
import grpc from 'grpc'

dotenv.config({ path: '.env'});

var PROTO_PATH = './helloworld.proto';
var proto = grpc.load(PROTO_PATH)

function sayHello(call, callback) {
	var result = []
	result.push({ _id: "5a0cae787f21fa41607cdd19", id: "5a0cae787f21fa41607cdd19", name: 'micro01', description: 'description' })
	callback(null, { message: JSON.stringify(result) });

	// kafka
	sendKafka(3)
}

// GRPC
var server = new grpc.Server();

server.addService(proto.helloworld.Greeter.service, { sayHello: sayHello });

server.bind(`${process.env.GRPC_HOST}:${process.env.GRPC_PORT}`, grpc.ServerCredentials.createInsecure());
server.start();



// KAFKA
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
			id: "5a0cae787f21fa31607cd123d19" + x,
			name: "prueba" + x,
			description: 'description'
		}
	};

	// Create a new payload
	var payload = [{
		topic: 'topic-test',
		messages: JSON.stringify(messageBuffer),
		attributes: 1 // !* Use GZip compression for the payload *!/
	}];

	producer.send(payload, function (error, result) {
		if (error) console.error(error);
	});
}