import "dotenv/config";

import * as http from "http";
import express from "express";
import morgan from "morgan";
import logger from "./logger.js";

import {ApolloServer} from "@apollo/server";
import {expressMiddleware} from "@apollo/server/express4";

import {typeDefs} from "./gql/typedefs.js";
import {resolvers} from "./gql/resolvers.js";

import {tokenExists} from "./services/cachedTokenProvider.js";

import indexRouter from "./routes/index.js";


// Setup Express
const app = express();

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
});

await apolloServer.start();

app.use(morgan(
    ":remote-addr :method :url :status :res[content-length] - :response-time ms",
    {
        "stream": {
            "write": (message) => logger.info(message)
        }
    }
));
app.use(function (req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({"message": "Unauthorized"});
    }
    const token = authHeader.split(" ");
    if (!token || token.length !== 2 || token[0] !== "Bearer") {
        return res.status(401).json({"message": "Unauthorized"});
    }
    tokenExists(token[1]).
        then((exists) => {
            if (!exists) {
                return res.status(401).json({"message": "Unauthorized"});
            }
            next();
        }).
        catch((err) => {
            logger.error(err);
            return res.status(500).json({"message": "Internal Server Error"});
        });
});
app.use(express.json());
app.use(express.urlencoded({"extended": false}));

app.use(
    "/",
    indexRouter
);

app.use(
    "/graphql",
    expressMiddleware(apolloServer)
);

const port = process.env.PORT || "3000";

const httpServer = http.createServer(app);
httpServer.listen(port);
httpServer.on(
    "error",
    onError
);
httpServer.on(
    "listening",
    onListening
);

/**
 * Event listener for HTTP server "error" event.
 */

function onError (error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
    case "EACCES":
        logger.error(port + " requires elevated privileges");
        process.exit(1);
        break;
    case "EADDRINUSE":
        logger.error(port + " is already in use");
        process.exit(1);
        break;
    default:
        throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening () {
    var addr = httpServer.address();
    var bind = typeof addr === "string"
        ? "pipe " + addr
        : "port " + addr.port;
    logger.info("Listening on " + bind);
}
