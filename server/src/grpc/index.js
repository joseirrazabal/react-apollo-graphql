import { promisifyAll } from 'bluebird'
import grpc from 'grpc'
import dotenv from 'dotenv'

dotenv.config()

const protoChannel = grpc.load('./src/grpc/protos/channel.proto').channel;

const Service = new protoChannel.Channel(`${process.env.GRPC_HOST}:${process.env.GRPC_PORT}`, grpc.credentials.createInsecure())
const ChannelService = promisifyAll(Service)

export { ChannelService }