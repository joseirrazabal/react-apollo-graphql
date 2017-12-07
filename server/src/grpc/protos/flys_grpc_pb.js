// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var flys_pb = require('./flys_pb.js');

function serialize_flys_FlyId(arg) {
  if (!(arg instanceof flys_pb.FlyId)) {
    throw new Error('Expected argument of type flys.FlyId');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_flys_FlyId(buffer_arg) {
  return flys_pb.FlyId.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_flys_GetAllFly(arg) {
  if (!(arg instanceof flys_pb.GetAllFly)) {
    throw new Error('Expected argument of type flys.GetAllFly');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_flys_GetAllFly(buffer_arg) {
  return flys_pb.GetAllFly.deserializeBinary(new Uint8Array(buffer_arg));
}


var FlysService = exports.FlysService = {
  getFly: {
    path: '/flys.Flys/GetFly',
    requestStream: false,
    responseStream: false,
    requestType: flys_pb.FlyId,
    responseType: flys_pb.GetAllFly,
    requestSerialize: serialize_flys_FlyId,
    requestDeserialize: deserialize_flys_FlyId,
    responseSerialize: serialize_flys_GetAllFly,
    responseDeserialize: deserialize_flys_GetAllFly,
  },
};

exports.FlysClient = grpc.makeGenericClientConstructor(FlysService);
