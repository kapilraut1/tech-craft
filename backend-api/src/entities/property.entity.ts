import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("decimal", { precision: 12, scale: 2 })
  price: number;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  image_url: string;
}
