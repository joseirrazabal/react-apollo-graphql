import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { apolloExpress, graphiqlExpress } from 'apollo-server';
import { Strategy as GitHubStrategy } from 'passport-github';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
// import knex from './sql/connector';

import { createServer } from 'http';
import { Server } from 'subscriptions-transport-ws';

// const KnexSessionStore = require('connect-session-knex')(session);
// const store = new KnexSessionStore({
//   knex,
// });

import { schema } from './src/schema';
// import { GitHubConnector } from './github/connector';
// import { Repositories, Users } from './github/models';
// import { Entries, Comments } from './sql/models';

import { SubscriptionManager } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';

const redisConnectionListener = (err) => {
  if (err) console.error(err); // eslint-disable-line no-console
  console.info('Succefuly connected to redis'); // eslint-disable-line no-console
};

// Docs on the different redis options
// https://github.com/NodeRedis/node_redis#options-object-properties
const redisOptions = {
  host: 'localhost',
  port: 6379,
  connect_timeout: 15000,
  enable_offline_queue: true,
  retry_unfulfilled_commands: true,
};

const pubsub = new RedisPubSub({
  connection: redisOptions,
  connectionListener: redisConnectionListener,
});

const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: {
    commentAdded: (options, args) => ({
      commentAdded: comment => comment.repository_name === args.repoFullName,
    }),
  },
});

dotenv.config({ silent: true });
let PORT = 3010;

if (process.env.PORT) {
  PORT = parseInt(process.env.PORT, 10) + 100;
}

const WS_PORT = process.env.WS_PORT || 8080;

// const {
//   GITHUB_CLIENT_ID,
//   GITHUB_CLIENT_SECRET,
// } = process.env;

const app = express();

// app.use(session({
//   secret: 'your secret',
//   resave: true,
//   saveUninitialized: true,
//   store,
// }));

// app.use(passport.initialize());
// app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('dist'));

// app.get('/login/github',
//   passport.authenticate('github'));

// app.get('/login/github/callback',
//   passport.authenticate('github', { failureRedirect: '/' }),
//   (req, res) => res.redirect('/'));

// app.get('/logout', (req, res) => {
//   req.logout();
//   res.redirect('/');
// });

app.use('/graphql', apolloExpress((req) => {
  // Get the query, the same way express-graphql does it
  // https://github.com/graphql/express-graphql/blob/3fa6e68582d6d933d37fa9e841da5d2aa39261cd/src/index.js#L257
  const query = req.query.query || req.body.query;
  if (query && query.length > 2000) {
    // None of our app's queries are this long
    // Probably indicates someone trying to send an overly expensive query
    throw new Error('Query too large.');
  }

//   let user;
//   if (req.user) {
    // We get req.user from passport-github with some pretty oddly named fields,
    // let's convert that to the fields in our schema, which match the GitHub
    // API field names.
//     user = {
//       login: req.user.username,
//       html_url: req.user.profileUrl,
//       avatar_url: req.user.photos[0].value,
//     };
//   }

//   const gitHubConnector = new GitHubConnector({
//     clientId: GITHUB_CLIENT_ID,
//     clientSecret: GITHUB_CLIENT_SECRET,
//   });

  return {
	schema,
	context
    // context: {
    //   user,
    //   Repositories: new Repositories({ connector: gitHubConnector }),
    //   Users: new Users({ connector: gitHubConnector }),
    //   Entries: new Entries(),
    //   Comments: new Comments(),
    // },
  };
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

app.listen(PORT, () => console.log( // eslint-disable-line no-console
  `API Server is now running on http://localhost:${PORT}`
));

// const gitHubStrategyOptions = {
//   clientID: GITHUB_CLIENT_ID,
//   clientSecret: GITHUB_CLIENT_SECRET,
//   callbackURL: 'http://localhost:3000/login/github/callback',
// };

// passport.use(new GitHubStrategy(gitHubStrategyOptions, (accessToken, refreshToken, profile, cb) => {
//   cb(null, profile);
// }));

// passport.serializeUser((user, cb) => cb(null, user));
// passport.deserializeUser((obj, cb) => cb(null, obj));

// WebSocket server for subscriptions

const httpServer = createServer((request, response) => {
  response.writeHead(404);
  response.end();
});

httpServer.listen(WS_PORT, () => console.log( // eslint-disable-line no-console
  `Websocket Server is now running on http://localhost:${WS_PORT}`
));

const websocketServer = null;

// TODO: clean up this API
// eslint-disable-next-line no-unused-vars
const server = new Server(
  {
    subscriptionManager,
    onSubscribe: params => {
    //   const gitHubConnector = new GitHubConnector({
    //     clientId: GITHUB_CLIENT_ID,
    //     clientSecret: GITHUB_CLIENT_SECRET,
    //   });
      return Object.assign({}, params, {
		  context
        context: {
        //   Repositories: new Repositories({ connector: gitHubConnector }),
        //   Users: new Users({ connector: gitHubConnector }),
        //   Entries: new Entries(),
        //   Comments: new Comments(),
        },
      });
    },
  },
  httpServer
);
