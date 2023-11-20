import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../.env" });


const port = process.env.DB_PORT as number | undefined;

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: port,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  migrationsRun: true,
  synchronize: true,
  logging: false,
  entities: ["src/database/models/*.{ts,js}"],
  migrations: ["src/database/migrations/*.{ts,js}"],
  subscribers: [],
});