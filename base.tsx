import {logger} from "@bogeychan/elysia-logger";
import html from "@elysiajs/html";
import jwt from "@elysiajs/jwt";
import staticPlugin from "@elysiajs/static";
import Elysia from "elysia";
import * as environment from "./environment";
import {JWTSchema} from "./schemas";

export const base = new Elysia({name: "base"})
  .use(html())
  .use(staticPlugin())
  .use(jwt<"jwt", typeof JWTSchema>({secret: environment.JWT_SECRET}))
  .use(
    logger({
      level: environment.LOG_LEVEL,
      transport: {target: "pino-pretty", options: {colorize: true}},
    }),
  );
