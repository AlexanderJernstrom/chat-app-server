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
import { User } from "./User";
import { Channel } from "./Channel";

@Entity()
@ObjectType()
export class Message extends BaseEntity {
  @Field((type) => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  body: string;

  @Field((type) => Date)
  @Column({ type: "date" })
  createdAt: Date;

  @Field()
  @Column()
  userId: string;

  @Field()
  @Column()
  channelId: string;

  @Field((type) => User)
  @Column((type) => User)
  user: User;

  @Field(() => Channel)
  @Column(() => Channel)
  channel: Channel;
}
