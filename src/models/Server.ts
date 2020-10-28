import {
  BaseEntity,
  Entity,
  ObjectID,
  ObjectIdColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class Server extends BaseEntity {
  @ObjectIdColumn()
  @Field((type) => ID)
  id: ObjectID;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  ownerId: string;

  @ManyToMany((type) => User)
  @JoinTable()
  members: User[];

  @Field((type) => User)
  @OneToOne((type) => User)
  @JoinColumn({ name: "ownerId" })
  owner: User;
}
