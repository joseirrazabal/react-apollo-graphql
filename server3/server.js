import grpc from 'grpc'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' });

var PROTO_PATH = './hotels.proto';
var proto = grpc.load(PROTO_PATH).hotels

function getHotels(call, callback) {
	var result = []
	result.push({ 
		id: "5a0cae787f21fa41607cdd19", 
		name: 'Ocean surf', 
		description: 'Este hotel de estilo Art Deco se construyó en 1940 y se encuentra enfrente de la bonita playa de arena blanca. Justo al lado del hotel los visitantes encontrarán varios restaurantes y bares. Las exclusivas tiendas de Bal Harbour Shops, entre las que destacan Saks Fifth Avenue y Neiman Marcus, están a 3 km del hotel. South Beach está a 8 km de distancia. Este hotel es el lugar ideal para unas vacaciones en familia, una escapada romántica, un viaje de negocios o una escapada tropical improvisada.',
		rooms: [
			{ type: "single", price: 753 },
			{ type: "doble ", price: 1387 },
			{ type: "triple", price: 1968 }
		]
	})
	result.push({ 
		id: "5a0cae787f21fa41603cdd19", 
		name: 'Rodeway', 
		description: 'Este hotel se construyó en 1940 y se encuentra enfrente de la bonita playa de arena blanca.',
		rooms: [
			{ type: "doble ", price: 806 },
			{ type: "triple", price: 1356 }
		]
	})
	result.push({ 
		id: "5a0cae787f21fa41602cdd19", 
		name: 'Indian creek', 
		description: 'Este hotel de estilo Art.',
		rooms: [
			{ type: "single", price: 685 },
			{ type: "doble ", price: 1484 },
		]
	})
	callback(null, result);
}

function getHotel(call, callback) {
	var result = {}
	result = { 
		id: "5a0cae787f21fa41607cdd19", 
		name: 'Ocean surf', 
		description: 'Este hotel de estilo Art Deco se construyó en 1940 y se encuentra enfrente de la bonita playa de arena blanca. Justo al lado del hotel los visitantes encontrarán varios restaurantes y bares. Las exclusivas tiendas de Bal Harbour Shops, entre las que destacan Saks Fifth Avenue y Neiman Marcus, están a 3 km del hotel. South Beach está a 8 km de distancia. Este hotel es el lugar ideal para unas vacaciones en familia, una escapada romántica, un viaje de negocios o una escapada tropical improvisada.',
		rooms: [
			{ type: "single", price: 753 },
			{ type: "doble ", price: 1387 },
			{ type: "triple", price: 1968 }
		]
	}
	callback(null, result);
}

// stream
// function getPrueba(call) {
// 	var result = []
// 	result.push({ id: "5a0cae787f21fa41607cdd19", name: 'micro01', description: 'description' })
// 	result.push({ id: "5a0cae787f31fa41607cdd19", name: 'micro02', description: 'description' })

// 	result.map( item => {
// 		call.write(item)
// 	})
// 	call.end()
// }

var server = new grpc.Server();

server.addService(proto.Hotels.service, { getHotels: getHotels, getHotel: getHotel });

server.bind(`${process.env.GRPC_HOST}:${process.env.GRPC_PORT}`, grpc.ServerCredentials.createInsecure());
server.start();
