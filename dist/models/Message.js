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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const User_1 = require("./User");
const Channel_1 = require("./Channel");
let Message = class Message extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field((type) => type_graphql_1.ID),
    typeorm_1.ObjectIdColumn(),
    __metadata("design:type", typeorm_1.ObjectID)
], Message.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Message.prototype, "body", void 0);
__decorate([
    type_graphql_1.Field((type) => Date),
    typeorm_1.Column({ type: "date" }),
    __metadata("design:type", Date)
], Message.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Message.prototype, "userId", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Message.prototype, "channelId", void 0);
__decorate([
    type_graphql_1.Field((type) => User_1.User),
    typeorm_1.Column((type) => User_1.User),
    __metadata("design:type", User_1.User)
], Message.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(() => Channel_1.Channel),
    typeorm_1.Column(() => Channel_1.Channel),
    __metadata("design:type", Channel_1.Channel)
], Message.prototype, "channel", void 0);
Message = __decorate([
    typeorm_1.Entity(),
    type_graphql_1.ObjectType()
], Message);
exports.Message = Message;
//# sourceMappingURL=Message.js.map