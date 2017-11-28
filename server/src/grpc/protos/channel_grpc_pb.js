// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var channel_pb = require('./channel_pb.js');

function serialize_channel_GetAllRequest(arg) {
  if (!(arg instanceof channel_pb.GetAllRequest)) {
    throw new Error('Expected argument of type channel.GetAllRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_channel_GetAllRequest(buffer_arg) {
  return channel_pb.GetAllRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_channel_GetAllResponse(arg) {
  if (!(arg instanceof channel_pb.GetAllResponse)) {
    throw new Error('Expected argument of type channel.GetAllResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_channel_GetAllResponse(buffer_arg) {
  return channel_pb.GetAllResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var ChannelService = exports.ChannelService = {
  getAll: {
    path: '/channel.Channel/getAll',
    requestStream: false,
    responseStream: false,
    requestType: channel_pb.GetAllRequest,
    responseType: channel_pb.GetAllResponse,
    requestSerialize: serialize_channel_GetAllRequest,
    requestDeserialize: deserialize_channel_GetAllRequest,
    responseSerialize: serialize_channel_GetAllResponse,
    responseDeserialize: deserialize_channel_GetAllResponse,
  },
};

exports.ChannelClient = grpc.makeGenericClientConstructor(ChannelService);
