import { User } from "../models/User";
import {
  Arg,
  Args,
  ArgsType,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import bcrypt from "bcryptjs";
import { getMongoRepository } from "typeorm";
import { sign } from "jsonwebtoken";
import { SECRET } from "../index";

@ArgsType()
class RegisterArgs {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver(User)
export class UserResolver {
  @Query((type) => User)
  async getUser(@Arg("id") id: string) {
    const userRepository = getMongoRepository(User);

    const user = await userRepository.findOne(id);

    return user;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<LoginResponse> {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User with that email does not exist");
    }

    const verify = await bcrypt.compare(password, user.password);

    if (!verify) {
      throw new Error("Email and password does not match, try again please");
    }

    return {
      accessToken: sign({ id: user.id }, process.env.SECRET as string),
    };
  }

  @Mutation((type) => Boolean)
  async createUser(
    @Args() { email, name, password }: RegisterArgs
  ): Promise<boolean> {
    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new Error("User with that email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      await User.insert({
        email,
        name,
        password: hashedPassword,
        serverIds: [],
      });
    } catch (error) {
      if (error) return false;
    }

    return true;
  }
}
