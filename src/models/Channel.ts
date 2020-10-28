import {
  BaseEntity,
  Entity,
  ObjectID,
  ObjectIdColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { Message } from "./Message";

@ObjectType()
@Entity()
export class Channel extends BaseEntity {
  @Field((type) => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  serverId: string;

  @Field()
  @Column()
  name: string;

  @ManyToOne((type) => Message, (message) => message.channel)
  messages: Message[];
}
