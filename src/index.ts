import Elysia from "elysia";
import { securitySetup } from "./startup/security";
import './database/db.setup';
import { docsSetup } from "./startup/docs";
import { logger } from "@grotto/logysia";
import { hooksSetup } from "./startup/hooks";
import { usuariosController } from "./controllers/usuarios.controller";
import { staticDataController } from "./controllers/static-data.controller";

const PORT = process.env.PORT || 3000;
export const app = new Elysia();

app
  //.use(securitySetup)
  .use(docsSetup)
  .use(logger())
  .use(hooksSetup)
  .get('/', () => 'Olá Bun.js!')
  .group('/api', (app: Elysia) =>
    app
    .use(usuariosController)
    .use(staticDataController)
    
  )
  .listen(PORT, () => {
    console.log(`🦊 Elysia is running at ${app.server?.hostname}:${PORT}`);
  });