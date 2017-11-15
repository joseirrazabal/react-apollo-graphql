// const { PubSub } = require('graphql-subscriptions');
// var pubsub = new PubSub();

// import { RedisPubSub } from 'graphql-redis-subscriptions';
// var pubsub = new RedisPubSub();

import { KafkaPubSub } from 'graphql-kafka-subscriptions'

var pubsub = new KafkaPubSub({
  topic: 'node-test',
  host: 'localhost',
  port: '9092',
})

export default pubsub