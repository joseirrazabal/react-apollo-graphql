// const { PubSub } = require('graphql-subscriptions');
// var pubsub = new PubSub();

// import { RedisPubSub } from 'graphql-redis-subscriptions';
// var pubsub = new RedisPubSub();

import { KafkaPubSub } from 'graphql-kafka-subscriptions'

var pubsub = new KafkaPubSub({
  topic: 'topic-test',
  host: '35.202.3.215',
  port: '9092',
})

export default pubsub