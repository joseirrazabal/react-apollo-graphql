import dotenv from 'dotenv'
import grpc from 'grpc'
import grpcPromise from 'grpc-promise';

dotenv.config()

const protoChannel = grpc.load('./src/grpc/protos/channel.proto').channel;

const ChannelService = new protoChannel.Channel(`${process.env.GRPC_HOST}:${process.env.GRPC_PORT}`, grpc.credentials.createInsecure())
grpcPromise.promisifyAll(ChannelService)

export { ChannelService }