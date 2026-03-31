import {
  Entity,
  type Relation,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Property } from "./property.entity";

@Entity()
export class Favourite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.favourites)
  user: Relation<User>;

  @ManyToOne(() => Property)
  property: Property;
}
