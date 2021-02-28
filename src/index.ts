import "reflect-metadata";
import dotenv from "dotenv";
import express from "express";
import { ApolloServer, PubSub } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { Connection, createConnection } from "typeorm";
import { Server } from "./models/Server";
import { Message } from "./models/Message";
import { Channel } from "./models/Channel";
import { User } from "./models/User";
import { UserResolver } from "./resolvers/UserResolver";
import { ServerResolver } from "./resolvers/ServerResolver";
import { ChannelResolver } from "./resolvers/ChannelResolver";
import { MessageResolver } from "./resolvers/Messageresolver";
import { createServer } from "http";

dotenv.config({ path: __dirname + "/.env" });
export const SECRET = process.env.SECRET;

const init = async () => {
  console.log(process.env.MONGO_URI, SECRET);
  const pubsub = new PubSub();
  const connection: Connection = await createConnection({
    type: "mongodb",
    url: process.env.MONGO_URI,
    entities: [Message, User, Server, Channel],
  });
  const app = express();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        UserResolver,
        ServerResolver,
        ChannelResolver,
        MessageResolver,
      ],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res, pubsub }),
    subscriptions: {
      onConnect: (a) => console.log("Connected"),
    },
    tracing: true,
  });

  apolloServer.applyMiddleware({ app, path: "/graphql", cors: true });

  const httpServer = createServer(app);

  apolloServer.installSubscriptionHandlers(httpServer);

  httpServer.listen(process.env.PORT || 4000, () => {
    console.log(apolloServer.subscriptionsPath);
  });
};

init();
