import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import passport from 'passport';
import session from 'express-session';
import ConnectMongo from 'connect-mongodb-session';

import { ApolloServer } from "@apollo/server";
import {expressMiddleware} from '@apollo/server/express4';
import {ApolloServerPluginDrainHttpServer} from '@apollo/server/plugin/drainHttpServer';

import {buildContext } from "graphql-passport";

import mergedResolvers from "./resolvers/index.js"; // Ensure `.js` is specified
import mergedTypeDefs from "./typeDefs/index.js";   // Ensure `.js` is specified

import {connectDB} from "./db/connectDB.js";
import { configurePassport } from './passport/passport.config.js';

dotenv.config();
configurePassport();

const app = express();
const _dirname = path.resolve();

const httpServer = http.createServer(app);

const MongoDBStore = ConnectMongo(session);

const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: "sessions"
})

store.on("error", (err) => console.log (err));

app.use (session({
    secret: process.env.SESSION_SECRET,
    resave: false, // required: only save session if something changed
    saveUninitialized: false, // option specifies whether to save uninitialized sessions
    cookie:{
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly : true, // httpOnly prevents client-side JS from accessing the cookie
    },
    store: store
})
)

app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})]

});

// Ensure we wait for our server to start
await server.start()

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
	"/graphql",
	cors({
        origin: "http://localhost:3000",
        credentials: true
    }),
	express.json(),
	// expressMiddleware accepts the same arguments:
	// an Apollo Server instance and optional configuration options
	expressMiddleware(server, {
		context: async ({ req, res}) => buildContext({req, res}),
	})
);

app.use(express.static(path.join(_dirname, "frontend/dist"))); 

app.get("*", (req, res) => {
    res.sendFile(path.join(_dirname, "frontend/dist", "index.html"));
})

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB ();

console.log(`🚀 Server ready at http://localhost:4000/graphql`);