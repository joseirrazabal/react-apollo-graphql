// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var channel_pb = require('./channel_pb.js');

function serialize_channel_ItemResponse(arg) {
  if (!(arg instanceof channel_pb.ItemResponse)) {
    throw new Error('Expected argument of type channel.ItemResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_channel_ItemResponse(buffer_arg) {
  return channel_pb.ItemResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_channel_Params(arg) {
  if (!(arg instanceof channel_pb.Params)) {
    throw new Error('Expected argument of type channel.Params');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_channel_Params(buffer_arg) {
  return channel_pb.Params.deserializeBinary(new Uint8Array(buffer_arg));
}


var ChannelService = exports.ChannelService = {
  getAll: {
    path: '/channel.Channel/getAll',
    requestStream: false,
    responseStream: false,
    requestType: channel_pb.Params,
    responseType: channel_pb.ItemResponse,
    requestSerialize: serialize_channel_Params,
    requestDeserialize: deserialize_channel_Params,
    responseSerialize: serialize_channel_ItemResponse,
    responseDeserialize: deserialize_channel_ItemResponse,
  },
};

exports.ChannelClient = grpc.makeGenericClientConstructor(ChannelService);
