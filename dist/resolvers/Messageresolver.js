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
exports.MessageResolver = void 0;
const Message_1 = require("../models/Message");
const type_graphql_1 = require("type-graphql");
const auth_1 = require("../middlewares/auth");
const User_1 = require("../models/User");
const typeorm_1 = require("typeorm");
const Channel_1 = require("../models/Channel");
let MessageResolver = class MessageResolver {
    sendMessage({ payload }, channelId, message, pubSub) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne(payload.id);
            const channel = yield Channel_1.Channel.findOne(channelId);
            const msg = yield Message_1.Message.create({
                body: message,
                channelId,
                userId: String(payload.id),
                createdAt: new Date(Date.now()),
                user,
            });
            yield msg.save();
            const msgPayload = {
                body: message,
                channelId,
                user,
                createdAt: msg.createdAt,
            };
            yield pubSub.publish("MESSAGE", msgPayload);
            return msg;
        });
    }
    getMessages({ payload }, channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield typeorm_1.getMongoRepository(Message_1.Message).find({
                where: {
                    channelId,
                },
            });
            return messages;
        });
    }
};
__decorate([
    type_graphql_1.UseMiddleware(auth_1.authorize),
    type_graphql_1.Mutation(() => Message_1.Message),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg("channelId")),
    __param(2, type_graphql_1.Arg("message")),
    __param(3, type_graphql_1.PubSub()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, type_graphql_1.PubSubEngine]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "sendMessage", null);
__decorate([
    type_graphql_1.UseMiddleware(auth_1.authorize),
    type_graphql_1.Query((returns) => [Message_1.Message]),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg("channelId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "getMessages", null);
MessageResolver = __decorate([
    type_graphql_1.Resolver(Message_1.Message)
], MessageResolver);
exports.MessageResolver = MessageResolver;
//# sourceMappingURL=Messageresolver.js.map