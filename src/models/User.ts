import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Entity,
  Column,
  ObjectIdColumn,
  ObjectID,
  OneToMany,
} from "typeorm";
import { Message } from "./Message";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field((type) => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  email: string;

  @Column()
  password: string;

  @Field((type) => [String])
  @Column()
  serverIds: string[];

  @OneToMany((type) => Message, (message) => message.user)
  messages: Message[];
}
