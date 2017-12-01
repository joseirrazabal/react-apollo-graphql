import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createServer, http } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { SubscriptionManager } from 'graphql-subscriptions';
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import { schema, LocalSchema } from './src';
import pubsub from './pubsub'
import grpcCompose from "./grpcComposer";

import initTracer from './tracer'
import { Tags, FORMAT_HTTP_HEADERS } from 'opentracing'

// creamos una función asíncrona autoejecutable para poder usar Async/Await
(async () => {
	dotenv.config()

	mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, { useMongoClient: true });
	const db = mongoose.connection;
	db.on('error', console.error.bind(console, 'Connection error:'));
	db.once('open', () => console.log('We are connected!'));

	const tracer = initTracer('Server01');
	
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
		schema: schema,
		pubsub: pubsub,
		setupFunctions: {
			// cuando alguien se suscribe a `todoUpdated` solo mandamos las del ID al que se suscribe
			// todoUpdated(options, args) {
			// 	return {
			// 		todoUpdated: {
			// 			filter: todo => todo.id === args.id,
			// 		},
			// 	};
			// },
		},
	});

	// definimos la URL `/graphql` que usa los middlewares `body-parser` y el `graphqlExpress`
	// usando el esquema ejecutable que creamos
	// app.use('/graphql', bodyParser.json(), graphqlExpress( (req) => { return { schema: LocalSchema } })) 
	app.use('/graphql', bodyParser.json(), graphqlExpress((req) => {
		const parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, req.headers)
		const span = tracer.startSpan('graph', { childOf: parentSpanContext, tags: { [Tags.SPAN_KIND]: Tags.SPAN_KIND_RPC_SERVER } });
		span.log({
			'event': 'graphql',
			'query': req.body.query,
			'variables': req.body.variables,
			'operationName': req.body.operationName
		});
		span.finish();

		return {
			schema: schema,
			context: grpcCompose.createContext({
				token: req.get("token"),
				Channel: {
					ip: "localhost",
					port: 50051
				}
			})
		};
	}));

	// si no estamos en producción
	if (process.env.NODE_ENV !== 'production') {
		// usamos el middleware `graphiqlExpress` para crear la URL `/ide` donde cargamos GraphiQL
		// este IDE va a consumir datos de la URL `/graphql` que creamos antes y `/subscriptions`
		app.use('/ide', graphiqlExpress({
			endpointURL: '/graphql',
			subscriptionsEndpoint: `ws://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/subscriptions`,
		}));
	}

	// iniciamos el servidor en el puerto y host que obtuvimos por variables de entorno
	server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, error => {
		// creamos el servidor de suscripciones usando el administrador de suscripciones
		// combinando el servidor HTTTP y definiendo la ruta `/subscriptions`
		new SubscriptionServer({ subscriptionManager }, { server, path: '/subscriptions' });
		// luego mostramos un simple log indicando la URL donde corre el servidor
		console.log('> Server running on http://%s:%d', process.env.SERVER_HOST, process.env.SERVER_PORT)
	});

})();