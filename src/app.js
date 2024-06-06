import 'dotenv/config';

import * as http from "http";
import express from "express";
import morgan from "morgan";
import logger from "./logger.js";

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import { typeDefs } from './gql/typedefs.js';
import { resolvers } from './gql/resolvers.js';

import indexRouter from "./routes/index.js";


// Setup Express
const app = express();

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
});

await apolloServer.start();

app.use(morgan(":remote-addr :method :url :status :res[content-length] - :response-time ms", {
    stream: {
        write: (message) => logger.info(message)
    }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

app.use('/graphql', expressMiddleware(apolloServer));

const port = process.env.PORT || '3000';

const httpServer = http.createServer(app);
httpServer.listen(port);
httpServer.on('error', onError);
httpServer.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger.error(port + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.error(port + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = httpServer.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    logger.info("Listening on " + bind);
}