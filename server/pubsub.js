import dotenv from 'dotenv'
dotenv.config()

// const { PubSub } = require('graphql-subscriptions');
// var pubsub = new PubSub();

// import { RedisPubSub } from 'graphql-redis-subscriptions';
// var pubsub = new RedisPubSub();

import { KafkaPubSub } from 'graphql-kafka-subscriptions'

var pubsub = new KafkaPubSub({
	topic: process.env.KAFKA_TOPIC,
	host: process.env.KAFKA_HOST,
	port: process.env.KAFKA_PORT,
})

export default pubsub