import express from 'express';
import {
	graphqlExpress,
	graphiqlExpress,
} from 'graphql-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { schema } from './src/schema';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import mongoose from 'mongoose'
import { SubscriptionManager } from 'graphql-subscriptions';
import pubsub from './pubsub'

import { server as serverConfig, database } from './src/config'
mongoose.connect(`mongodb://${database.host}:${database.port}/${database.name}`, { useMongoClient: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => console.log('We are connected!'));

// creamos una función asíncrona autoejecutable para poder usar Async/Await
(async () => {
	// try {
	// intentamos sincronizar nuestro modelo con la BD
	// si estamos en desarollo forzamos el sincronizado
	// borrando los datos viejos
	// await Todo.sync({ force: NODE_ENV !== 'production' });
	// } catch (error) {
	// si ocurre un error mostramos el error y matamos el proceso
	// 	console.log(error);
	// 	process.exit(0);
	// }

	// creamos una aplicación de express y un servidor HTTP apartir de esta
	const app = express();
	const server = createServer(app);

	// usamos 3 los middlewares que importamos
	app.use(cors());
	// app.use(compression());
	// app.use(morgan('common'));

	// creamos nuestro administrador de suscripciones usando nuestro esquema ejecutable
	// y nuestro módulo de PubSub y definimos como manejar cada suscripción
	const subscriptionManager = new SubscriptionManager({
		schema,
		pubsub,
		setupFunctions: {
			// cuando alguien se suscribe a `todoUpdated` solo mandamos las del ID al que se suscribe
			todoUpdated(options, args) {
				return {
					todoUpdated: {
						filter: todo => todo.id === args.id,
					},
				};
			},
			// cuando alguien se suscribe a `todoCreated` solo enviamos las del status
			// al que el cliente se suscribe
			todoCreated(options, args) {
				return {
					todoCreated: {
						filter: todo => todo.status === args.status,
					},
				};
			},
		},
	});

	// definimos la URL `/graphql` que usa los middlewares `body-parser` y el `graphqlExpress`
	// usando el esquema ejecutable que creamos
	app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

	// si no estamos en producción
	// if (NODE_ENV !== 'production') {
		// usamos el middleware `graphiqlExpress` para crear la URL `/ide` donde cargamos GraphiQL
		// este IDE va a consumir datos de la URL `/graphql` que creamos antes y `/subscriptions`
		app.use('/ide', graphiqlExpress({
			endpointURL: '/graphql',
			subscriptionsEndpoint: `ws://${serverConfig.host}:${serverConfig.port}/subscriptions`,
		}));
	// }

	// iniciamos el servidor en el puerto y host que obtuvimos por variables de entorno
	server.listen(serverConfig.port, serverConfig.host, error => {
		// creamos el servidor de suscripciones usando el administrador de suscripciones
		// combinando el servidor HTTTP y definiendo la ruta `/subscriptions`
		new SubscriptionServer({ subscriptionManager }, { server, path: '/subscriptions' });
		// luego mostramos un simple log indicando la URL donde corre el servidor
		console.log('> Server running on http://%s:%d', serverConfig.host, serverConfig.port)
	});

	// server.listen(serverConfig.port, () => {
	// 	console.log(`GraphQL Server is now running on http://localhost:${serverConfig.port}`);
	// 	new SubscriptionServer({
	// 		execute,
	// 		subscribe,
	// 		schema
	// 	}, {
	// 			server: server,
	// 			path: '/subscriptions',
	// 		});
	// });

})();