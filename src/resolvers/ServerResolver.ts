import { authorize, Context } from "../middlewares/auth";
import { User } from "../models/User";
import {
  Arg,
  ArgsType,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Server } from "../models/Server";
import { getMongoManager, getMongoRepository, MongoRepository } from "typeorm";
import { Channel } from "../models/Channel";
import { Message } from "../models/Message";

@ObjectType()
class ServerResponse {
  @Field(() => Server)
  server: Server;

  @Field(() => [Channel])
  channels: Channel[];

  @Field(() => [Message])
  messages: Message[];
}

@Resolver(Server)
export class ServerResolver {
  @UseMiddleware(authorize)
  @Mutation((returns) => Boolean)
  async createServer(@Ctx() { payload }: Context, @Arg("name") name: string) {
    const user = await User.findOne(payload.id);
    const server = await Server.insert({
      name,
      ownerId: String(payload.id),
      owner: user,
      members: [user as User],
    });

    (user as User).serverIds = [
      ...(user as User).serverIds,
      server.identifiers[0].id,
    ];
    user?.save();
    //console.log(server.id);
    //(user as User).serverIds = [...(user as User).serverIds, String(server.id)];
    //await (user as User).save();
    return true;
  }

  @UseMiddleware(authorize)
  @Mutation((returns) => Boolean)
  async inviteMember(
    @Ctx() { payload }: Context,
    @Arg("email") email: string,
    @Arg("serverId") serverId: string
  ) {
    const server = await Server.findOne(serverId);
    const user = await User.findOne({ email });
    const userExists = await Server.findOne({
      where: {
        members: { $in: [user] },
      },
    });
    if (userExists) {
      return false;
    }
    console.log(server?.members);
    (server as any).members = [...(server as any).members, user];

    await server?.save().catch((err) => console.log(err));

    return true;
  }

  @UseMiddleware(authorize)
  @Query(() => [Server])
  async getServers(@Ctx() { payload }: Context) {
    const user = await User.findOne(String(payload.id));
    const servers = await Server.findByIds(user?.serverIds as string[]);
    console.log(payload.id);

    return servers;
  }

  @UseMiddleware(authorize)
  @Query(() => [User])
  async getMembersInServer(
    @Ctx() { payload }: Context,
    @Arg("serverId") serverId: string
  ): Promise<User[]> {
    const server = await Server.findOne(serverId);
    console.log(server);
    return server?.members as User[];
  }

  @UseMiddleware(authorize)
  @Query((returns) => ServerResponse)
  async getServer(
    @Ctx() { payload }: Context,
    @Arg("id") id: string
  ): Promise<{ server: Server; channels: Channel[]; messages: Message[] }> {
    const server = await Server.findOne(id);
    const channels = await Channel.find({ serverId: id });
    const channelIds = channels.map((chat) => String(chat.id));
    const messages = await getMongoRepository(Message).find({
      where: {
        channelId: { $in: channelIds },
      },
    });

    return { server: server as Server, channels, messages };
  }
}
