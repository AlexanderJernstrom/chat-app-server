import { Channel } from "../models/Channel";
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  Subscription,
  UseMiddleware,
} from "type-graphql";
import { authorize, Context } from "../middlewares/auth";
import { PubSub } from "apollo-server-express";
import { User } from "../models/User";
import { Message } from "../models/Message";

@ArgsType()
class CreateChannelArgs {
  @Field()
  serverId: string;

  @Field()
  channelName: string;
}

@ObjectType()
class GetMessageType {
  @Field()
  body: string;

  @Field()
  user: User;

  @Field()
  createdAt: Date;

  @Field()
  channelId: string;

  @Field()
  sent: string;
}

const pubsub = new PubSub();
@Resolver(Channel)
export class ChannelResolver {
  @UseMiddleware(authorize)
  @Mutation((type) => Boolean)
  async createChannel(
    @Ctx() { payload }: Context,
    @Args() { serverId, channelName }: CreateChannelArgs
  ) {
    await Channel.insert({
      name: channelName,
      serverId,
    });
    return true;
  }

  @Subscription(() => Message, {
    topics: "MESSAGE",
    filter: ({ payload, args }) => payload.channelId === args.channelId,
  })
  async getMessage(
    @Root() payload: Message,
    @Arg("channelId") channelId: String
  ) {
    return payload;
  }

  @UseMiddleware(authorize)
  @Query((type) => [Channel])
  async getChannelsInServer(
    @Ctx() { payload }: Context,
    @Arg("serverId") serverId: string
  ): Promise<Channel[]> {
    return await Channel.find({ serverId });
  }
}
