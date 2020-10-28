import { Message } from "../models/Message";
import {
  Arg,
  Ctx,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { authorize, Context } from "../middlewares/auth";
import { User } from "../models/User";
import { getMongoRepository } from "typeorm";
import { Channel } from "../models/Channel";

@Resolver(Message)
export class MessageResolver {
  @UseMiddleware(authorize)
  @Mutation(() => Message)
  async sendMessage(
    @Ctx() { payload }: Context,
    @Arg("channelId") channelId: string,
    @Arg("message") message: string,
    @PubSub() pubSub: PubSubEngine
  ) {
    const user = await User.findOne(payload.id);
    const channel = await Channel.findOne(channelId);
    const msg = await Message.create({
      body: message,
      channelId,
      userId: String(payload.id),
      createdAt: new Date(Date.now()),
      user,
    });
    await msg.save();

    const msgPayload = {
      body: message,
      channelId,
      user,
      createdAt: msg.createdAt,
    };
    await pubSub.publish("MESSAGE", msgPayload);

    return msg;
  }

  @UseMiddleware(authorize)
  @Query((returns) => [Message])
  async getMessages(
    @Ctx() { payload }: Context,
    @Arg("channelId") channelId: string
  ) {
    const messages = await getMongoRepository(Message).find({
      where: {
        channelId,
      },
    });

    return messages;
  }
}
