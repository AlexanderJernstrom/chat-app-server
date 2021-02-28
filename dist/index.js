"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET = void 0;
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Server_1 = require("./models/Server");
const Message_1 = require("./models/Message");
const Channel_1 = require("./models/Channel");
const User_1 = require("./models/User");
const UserResolver_1 = require("./resolvers/UserResolver");
const ServerResolver_1 = require("./resolvers/ServerResolver");
const ChannelResolver_1 = require("./resolvers/ChannelResolver");
const Messageresolver_1 = require("./resolvers/Messageresolver");
const http_1 = require("http");
dotenv_1.default.config({ path: __dirname + "/.env" });
exports.SECRET = process.env.SECRET;
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(process.env.MONGO_URI, exports.SECRET);
    const pubsub = new apollo_server_express_1.PubSub();
    const connection = yield typeorm_1.createConnection({
        type: "mongodb",
        url: process.env.MONGO_URI,
        entities: [Message_1.Message, User_1.User, Server_1.Server, Channel_1.Channel],
    });
    const app = express_1.default();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [
                UserResolver_1.UserResolver,
                ServerResolver_1.ServerResolver,
                ChannelResolver_1.ChannelResolver,
                Messageresolver_1.MessageResolver,
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
    const httpServer = http_1.createServer(app);
    apolloServer.installSubscriptionHandlers(httpServer);
    httpServer.listen(process.env.PORT || 4000, () => {
        console.log(apolloServer.subscriptionsPath);
    });
});
init();
//# sourceMappingURL=index.js.map