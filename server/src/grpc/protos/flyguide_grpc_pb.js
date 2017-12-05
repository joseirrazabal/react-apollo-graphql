// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var flyguide_pb = require('./flyguide_pb.js');

function serialize_flyguide_Fly(arg) {
  if (!(arg instanceof flyguide_pb.Fly)) {
    throw new Error('Expected argument of type flyguide.Fly');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_flyguide_Fly(buffer_arg) {
  return flyguide_pb.Fly.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_flyguide_FlyId(arg) {
  if (!(arg instanceof flyguide_pb.FlyId)) {
    throw new Error('Expected argument of type flyguide.FlyId');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_flyguide_FlyId(buffer_arg) {
  return flyguide_pb.FlyId.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_flyguide_FlyRange(arg) {
  if (!(arg instanceof flyguide_pb.FlyRange)) {
    throw new Error('Expected argument of type flyguide.FlyRange');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_flyguide_FlyRange(buffer_arg) {
  return flyguide_pb.FlyRange.deserializeBinary(new Uint8Array(buffer_arg));
}


var FlyGuideService = exports.FlyGuideService = {
  // TODO: --> Hacer la prueba con el repetead.
  getFlys: {
    path: '/flyguide.FlyGuide/GetFlys',
    requestStream: false,
    responseStream: true,
    requestType: flyguide_pb.FlyRange,
    responseType: flyguide_pb.Fly,
    requestSerialize: serialize_flyguide_FlyRange,
    requestDeserialize: deserialize_flyguide_FlyRange,
    responseSerialize: serialize_flyguide_Fly,
    responseDeserialize: deserialize_flyguide_Fly,
  },
  getFly: {
    path: '/flyguide.FlyGuide/GetFly',
    requestStream: false,
    responseStream: true,
    requestType: flyguide_pb.FlyId,
    responseType: flyguide_pb.Fly,
    requestSerialize: serialize_flyguide_FlyId,
    requestDeserialize: deserialize_flyguide_FlyId,
    responseSerialize: serialize_flyguide_Fly,
    responseDeserialize: deserialize_flyguide_Fly,
  },
};

exports.FlyGuideClient = grpc.makeGenericClientConstructor(FlyGuideService);
