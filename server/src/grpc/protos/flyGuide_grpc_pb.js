// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var src_grpc_protos_flyGuide_pb = require('../../../src/grpc/protos/flyGuide_pb.js');

function serialize_flyguide_FlyId(arg) {
  if (!(arg instanceof src_grpc_protos_flyGuide_pb.FlyId)) {
    throw new Error('Expected argument of type flyguide.FlyId');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_flyguide_FlyId(buffer_arg) {
  return src_grpc_protos_flyGuide_pb.FlyId.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_flyguide_GetAllFly(arg) {
  if (!(arg instanceof src_grpc_protos_flyGuide_pb.GetAllFly)) {
    throw new Error('Expected argument of type flyguide.GetAllFly');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_flyguide_GetAllFly(buffer_arg) {
  return src_grpc_protos_flyGuide_pb.GetAllFly.deserializeBinary(new Uint8Array(buffer_arg));
}


var FlyGuideService = exports.FlyGuideService = {
  getFly: {
    path: '/flyguide.FlyGuide/GetFly',
    requestStream: false,
    responseStream: false,
    requestType: src_grpc_protos_flyGuide_pb.FlyId,
    responseType: src_grpc_protos_flyGuide_pb.GetAllFly,
    requestSerialize: serialize_flyguide_FlyId,
    requestDeserialize: deserialize_flyguide_FlyId,
    responseSerialize: serialize_flyguide_GetAllFly,
    responseDeserialize: deserialize_flyguide_GetAllFly,
  },
};

exports.FlyGuideClient = grpc.makeGenericClientConstructor(FlyGuideService);
