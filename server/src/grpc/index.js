import { promisifyAll } from 'bluebird'
import grpc from 'grpc'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import uuid from 'uuid'

dotenv.config()

const protoChannel = grpc.load('./src/grpc/protos/channel.proto').channel;

const metadataUpdater = (serviceUrl, callback) => {
      const metadata = new grpc.Metadata();
      metadata.set('Authorization', "prueba");
      metadata.set('requestId', uuid.v1());
      callback(null, metadata);
    };
const metadataCreds = grpc.credentials.createFromMetadataGenerator(metadataUpdater);

const ssl_creds = grpc.credentials.createSsl(
	fs.readFileSync(path.join(process.cwd(), "server.crt")),
	fs.readFileSync(path.join(process.cwd(), "server.key")),
	fs.readFileSync(path.join(process.cwd(), "server.crt"))
)

const combined_creds = grpc.credentials.combineCallCredentials(ssl_creds, metadataCreds);

// const Service = new protoChannel.Channel(`${process.env.GRPC_HOST}:${process.env.GRPC_PORT}`, grpc.credentials.createInsecure())
const Service = new protoChannel.Channel(`${process.env.GRPC_HOST}:${process.env.GRPC_PORT}`, combined_creds)
const ChannelService = promisifyAll(Service)

export { ChannelService }