// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var src_grpc_protos_channel_pb = require('../../../src/grpc/protos/channel_pb.js');

function serialize_channel_GetAllRequest(arg) {
  if (!(arg instanceof src_grpc_protos_channel_pb.GetAllRequest)) {
    throw new Error('Expected argument of type channel.GetAllRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_channel_GetAllRequest(buffer_arg) {
  return src_grpc_protos_channel_pb.GetAllRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_channel_GetAllResponse(arg) {
  if (!(arg instanceof src_grpc_protos_channel_pb.GetAllResponse)) {
    throw new Error('Expected argument of type channel.GetAllResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_channel_GetAllResponse(buffer_arg) {
  return src_grpc_protos_channel_pb.GetAllResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_channel_Item(arg) {
  if (!(arg instanceof src_grpc_protos_channel_pb.Item)) {
    throw new Error('Expected argument of type channel.Item');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_channel_Item(buffer_arg) {
  return src_grpc_protos_channel_pb.Item.deserializeBinary(new Uint8Array(buffer_arg));
}


var ChannelService = exports.ChannelService = {
  getAll: {
    path: '/channel.Channel/getAll',
    requestStream: false,
    responseStream: false,
    requestType: src_grpc_protos_channel_pb.GetAllRequest,
    responseType: src_grpc_protos_channel_pb.GetAllResponse,
    requestSerialize: serialize_channel_GetAllRequest,
    requestDeserialize: deserialize_channel_GetAllRequest,
    responseSerialize: serialize_channel_GetAllResponse,
    responseDeserialize: deserialize_channel_GetAllResponse,
  },
  prueba: {
    path: '/channel.Channel/prueba',
    requestStream: false,
    responseStream: true,
    requestType: src_grpc_protos_channel_pb.GetAllRequest,
    responseType: src_grpc_protos_channel_pb.Item,
    requestSerialize: serialize_channel_GetAllRequest,
    requestDeserialize: deserialize_channel_GetAllRequest,
    responseSerialize: serialize_channel_Item,
    responseDeserialize: deserialize_channel_Item,
  },
};

exports.ChannelClient = grpc.makeGenericClientConstructor(ChannelService);
