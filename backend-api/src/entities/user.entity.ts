import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Favourite } from "./favourite.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ default: "buyer" })
  role: string;

  @OneToMany(() => Favourite, (favourite) => favourite.user)
  favourites: Favourite[];
}
