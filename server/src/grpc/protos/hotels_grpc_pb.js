// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var src_grpc_protos_hotels_pb = require('../../../src/grpc/protos/hotels_pb.js');

function serialize_hotels_HotelRequest(arg) {
  if (!(arg instanceof src_grpc_protos_hotels_pb.HotelRequest)) {
    throw new Error('Expected argument of type hotels.HotelRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_hotels_HotelRequest(buffer_arg) {
  return src_grpc_protos_hotels_pb.HotelRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_hotels_HotelResponse(arg) {
  if (!(arg instanceof src_grpc_protos_hotels_pb.HotelResponse)) {
    throw new Error('Expected argument of type hotels.HotelResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_hotels_HotelResponse(buffer_arg) {
  return src_grpc_protos_hotels_pb.HotelResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_hotels_HotelsRequest(arg) {
  if (!(arg instanceof src_grpc_protos_hotels_pb.HotelsRequest)) {
    throw new Error('Expected argument of type hotels.HotelsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_hotels_HotelsRequest(buffer_arg) {
  return src_grpc_protos_hotels_pb.HotelsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_hotels_HotelsResponse(arg) {
  if (!(arg instanceof src_grpc_protos_hotels_pb.HotelsResponse)) {
    throw new Error('Expected argument of type hotels.HotelsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_hotels_HotelsResponse(buffer_arg) {
  return src_grpc_protos_hotels_pb.HotelsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var HotelsService = exports.HotelsService = {
  getHotels: {
    path: '/hotels.Hotels/GetHotels',
    requestStream: false,
    responseStream: false,
    requestType: src_grpc_protos_hotels_pb.HotelsRequest,
    responseType: src_grpc_protos_hotels_pb.HotelsResponse,
    requestSerialize: serialize_hotels_HotelsRequest,
    requestDeserialize: deserialize_hotels_HotelsRequest,
    responseSerialize: serialize_hotels_HotelsResponse,
    responseDeserialize: deserialize_hotels_HotelsResponse,
  },
  getHotel: {
    path: '/hotels.Hotels/GetHotel',
    requestStream: false,
    responseStream: false,
    requestType: src_grpc_protos_hotels_pb.HotelRequest,
    responseType: src_grpc_protos_hotels_pb.HotelResponse,
    requestSerialize: serialize_hotels_HotelRequest,
    requestDeserialize: deserialize_hotels_HotelRequest,
    responseSerialize: serialize_hotels_HotelResponse,
    responseDeserialize: deserialize_hotels_HotelResponse,
  },
};

exports.HotelsClient = grpc.makeGenericClientConstructor(HotelsService);
