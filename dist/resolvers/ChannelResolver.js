"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelResolver = void 0;
const Channel_1 = require("../models/Channel");
const type_graphql_1 = require("type-graphql");
const auth_1 = require("../middlewares/auth");
const apollo_server_express_1 = require("apollo-server-express");
const User_1 = require("../models/User");
const Message_1 = require("../models/Message");
let CreateChannelArgs = class CreateChannelArgs {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CreateChannelArgs.prototype, "serverId", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CreateChannelArgs.prototype, "channelName", void 0);
CreateChannelArgs = __decorate([
    type_graphql_1.ArgsType()
], CreateChannelArgs);
let GetMessageType = class GetMessageType {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], GetMessageType.prototype, "body", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", User_1.User)
], GetMessageType.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Date)
], GetMessageType.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], GetMessageType.prototype, "channelId", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], GetMessageType.prototype, "sent", void 0);
GetMessageType = __decorate([
    type_graphql_1.ObjectType()
], GetMessageType);
const pubsub = new apollo_server_express_1.PubSub();
let ChannelResolver = class ChannelResolver {
    createChannel({ payload }, { serverId, channelName }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Channel_1.Channel.insert({
                name: channelName,
                serverId,
            });
            return true;
        });
    }
    getMessage(payload, channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return payload;
        });
    }
    getChannelsInServer({ payload }, serverId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Channel_1.Channel.find({ serverId });
        });
    }
};
__decorate([
    type_graphql_1.UseMiddleware(auth_1.authorize),
    type_graphql_1.Mutation((type) => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateChannelArgs]),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "createChannel", null);
__decorate([
    type_graphql_1.Subscription(() => Message_1.Message, {
        topics: "MESSAGE",
        filter: ({ payload, args }) => payload.channelId === args.channelId,
    }),
    __param(0, type_graphql_1.Root()),
    __param(1, type_graphql_1.Arg("channelId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Message_1.Message,
        String]),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "getMessage", null);
__decorate([
    type_graphql_1.UseMiddleware(auth_1.authorize),
    type_graphql_1.Query((type) => [Channel_1.Channel]),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg("serverId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "getChannelsInServer", null);
ChannelResolver = __decorate([
    type_graphql_1.Resolver(Channel_1.Channel)
], ChannelResolver);
exports.ChannelResolver = ChannelResolver;
//# sourceMappingURL=ChannelResolver.js.map