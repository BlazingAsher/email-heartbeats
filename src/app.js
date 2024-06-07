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

if (process.env.TRUST_PROXY) {
    if (process.env.TRUST_PROXY === "true") {
        app.set(
            "trust proxy",
            true
        );
    } else {
        app.set(
            "trust proxy",
            process.env.TRUST_PROXY
        );
    }
}

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
});

await apolloServer.start();

morgan.token(
    "path",
    (req) => req.originalUrl.split("?", 1)[0]
);

app.use(morgan(
    ":remote-addr :method :path :status :res[content-length] - :response-time ms",
    {
        "stream": {
            "write": (message) => logger.info(message)
        }
    }
));
app.use(function handleAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    const authQuery = req.query.token;

    if (!authHeader && !authQuery) {
        return res.status(401).json({"message": "Unauthorized"});
    }

    let token = null;

    if (authHeader) {
        const authData = authHeader.split(
            " ",
            2
        );
        if (!authData || authData.length !== 2 || authData[0] !== "Bearer") {
            return res.status(401).json({"message": "Unauthorized"});
        }

        token = authData[1];
    } else {
        token = authQuery;
    }

    tokenExists(token).
        then((exists) => {
            if (!exists) {
                return res.status(401).json({"message": "Unauthorized"});
            }
            next();
        }).
        catch((err) => {
            logger.error(
                "Unable to validate token.",
                err
            );
            return res.status(500).json({"message": "Internal Server Error"});
        });
});
app.use(express.json());

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
