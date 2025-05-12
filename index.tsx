import {Elysia, file} from "elysia";
import {base} from "./base";
import * as environment from "./environment";
import * as pages from "./pages";

declare global {
  namespace JSX {
    interface HtmlTag {
      _?: string;
    }
  }
}

const app = new Elysia()
  .use(base)
  .use(pages.home)
  .use(pages.login)
  .use(pages.post)
  .use(pages.register)
  .use(pages.settings)
  .use(pages.submit)
  .get("/public/style.css", () => file("./public/style.css"))
  .get("/public/sceneconnect.png", () => file("./public/sceneconnect.png"))
  .get("/public/favicon.png", () => file("./public/favicon.png"))
  .onError(({error}) => {
    console.error(error);
  })
  .listen({
    hostname: environment.HOSTNAME,
    port: environment.PORT,
  });

export type App = typeof app;

console.log(` Listening at http://${environment.HOSTNAME}:${environment.PORT}`);
