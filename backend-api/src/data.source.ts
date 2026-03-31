import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/user.entity";
import { Property } from "./entities/property.entity";
import { Favourite } from "./entities/favourite.entity";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "realtor_db",
  synchronize: true,
  logging: false,
  entities: [User, Property, Favourite],
  subscribers: [],
});
