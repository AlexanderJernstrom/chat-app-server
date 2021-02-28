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
exports.ServerResolver = void 0;
const auth_1 = require("../middlewares/auth");
const User_1 = require("../models/User");
const type_graphql_1 = require("type-graphql");
const Server_1 = require("../models/Server");
const typeorm_1 = require("typeorm");
const Channel_1 = require("../models/Channel");
const Message_1 = require("../models/Message");
let ServerResponse = class ServerResponse {
};
__decorate([
    type_graphql_1.Field(() => Server_1.Server),
    __metadata("design:type", Server_1.Server)
], ServerResponse.prototype, "server", void 0);
__decorate([
    type_graphql_1.Field(() => [Channel_1.Channel]),
    __metadata("design:type", Array)
], ServerResponse.prototype, "channels", void 0);
__decorate([
    type_graphql_1.Field(() => [Message_1.Message]),
    __metadata("design:type", Array)
], ServerResponse.prototype, "messages", void 0);
ServerResponse = __decorate([
    type_graphql_1.ObjectType()
], ServerResponse);
let ServerResolver = class ServerResolver {
    createServer({ payload }, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne(payload.id);
            const server = yield Server_1.Server.insert({
                name,
                ownerId: String(payload.id),
                owner: user,
                members: [user],
            });
            user.serverIds = [
                ...user.serverIds,
                server.identifiers[0].id,
            ];
            user === null || user === void 0 ? void 0 : user.save();
            return true;
        });
    }
    inviteMember({ payload }, email, serverId) {
        return __awaiter(this, void 0, void 0, function* () {
            const server = yield Server_1.Server.findOne(serverId);
            const user = yield User_1.User.findOne({ email });
            const userExists = yield Server_1.Server.findOne({
                where: {
                    members: { $in: [user] },
                },
            });
            if (userExists) {
                return false;
            }
            console.log(server === null || server === void 0 ? void 0 : server.members);
            server.members = [...server.members, user];
            yield (server === null || server === void 0 ? void 0 : server.save().catch((err) => console.log(err)));
            return true;
        });
    }
    getServers({ payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne(String(payload.id));
            const servers = yield Server_1.Server.findByIds(user === null || user === void 0 ? void 0 : user.serverIds);
            console.log(payload.id);
            return servers;
        });
    }
    getMembersInServer({ payload }, serverId) {
        return __awaiter(this, void 0, void 0, function* () {
            const server = yield Server_1.Server.findOne(serverId);
            console.log(server);
            return server === null || server === void 0 ? void 0 : server.members;
        });
    }
    getServer({ payload }, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const server = yield Server_1.Server.findOne(id);
            const channels = yield Channel_1.Channel.find({ serverId: id });
            const channelIds = channels.map((chat) => String(chat.id));
            const messages = yield typeorm_1.getMongoRepository(Message_1.Message).find({
                where: {
                    channelId: { $in: channelIds },
                },
            });
            return { server: server, channels, messages };
        });
    }
};
__decorate([
    type_graphql_1.UseMiddleware(auth_1.authorize),
    type_graphql_1.Mutation((returns) => Boolean),
    __param(0, type_graphql_1.Ctx()), __param(1, type_graphql_1.Arg("name")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ServerResolver.prototype, "createServer", null);
__decorate([
    type_graphql_1.UseMiddleware(auth_1.authorize),
    type_graphql_1.Mutation((returns) => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg("email")),
    __param(2, type_graphql_1.Arg("serverId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ServerResolver.prototype, "inviteMember", null);
__decorate([
    type_graphql_1.UseMiddleware(auth_1.authorize),
    type_graphql_1.Query(() => [Server_1.Server]),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerResolver.prototype, "getServers", null);
__decorate([
    type_graphql_1.UseMiddleware(auth_1.authorize),
    type_graphql_1.Query(() => [User_1.User]),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg("serverId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ServerResolver.prototype, "getMembersInServer", null);
__decorate([
    type_graphql_1.UseMiddleware(auth_1.authorize),
    type_graphql_1.Query((returns) => ServerResponse),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ServerResolver.prototype, "getServer", null);
ServerResolver = __decorate([
    type_graphql_1.Resolver(Server_1.Server)
], ServerResolver);
exports.ServerResolver = ServerResolver;
//# sourceMappingURL=ServerResolver.js.map