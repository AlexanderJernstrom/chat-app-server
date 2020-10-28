import "reflect-metadata";
import "dotenv/config";
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

export const SECRET = "fsdhfjkasdhjkfhjksdfjkhjkashdfjkhsadkhfkhsdjkfhkjsda";

const init = async () => {
  const pubsub = new PubSub();
  const connection: Connection = await createConnection({
    type: "mongodb",
    url:
      "mongodb+srv://alex123:brazil56@cluster0.clowh.mongodb.net/<dbname>?retryWrites=true&w=majority",
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

  apolloServer.applyMiddleware({ app, cors: true });

  const httpServer = createServer(app);

  apolloServer.installSubscriptionHandlers(httpServer);

  httpServer.listen(process.env.PORT || 4000, () => {
    console.log(apolloServer.subscriptionsPath);
  });
};

init();
