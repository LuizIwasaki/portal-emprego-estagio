import express from "express";
import cors from "cors";
import { DataSource } from "typeorm";
import { AppDataSource } from "./database/data-source";
import routes from "./routes";
import { errors } from "celebrate";

export let connection: DataSource;
const PORT = process.env.PORT || 4001;

const app = express();

app.use(express.json());

app.use(cors());
app.use(routes);

AppDataSource.initialize().then(c => {
  connection = c;
  c.runMigrations();
  runBackend();
})
.catch(e => {
  console.error(`Failed to create a connection:`);
  console.error(e);
});

function runBackend() {
  const app = express();
  app.use(cors())
  app.use(express.json());
  app.use(routes);
  app.use(errors());
  app.listen(PORT, () => console.log(`[.] Backend iniciado com sucesso!, porta: ${PORT}`));
}