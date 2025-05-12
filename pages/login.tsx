import {Html} from "@elysiajs/html";
import Elysia, {t} from "elysia";
import {base} from "../base";
import {Button} from "../components/button";
import {Input} from "../components/input";
import {Label} from "../components/label";
import {Link} from "../components/link";
import {sql} from "../database";
import {Layout} from "../layouts/layout";

export const login = new Elysia({name: "page.login"})
  .use(base)
  .get(
    "/login",
    async ({jwt, cookie: {auth}}) => {
      const session = (await jwt.verify(auth.value)) || undefined;
      return (
        <Layout title="Login" session={session}>
          <div class="flex flex-col gap-2 p-4">
            <h1 class="text-xl">Login</h1>
            <form
              hx-post="/login"
              hx-target=".target"
              hx-swap="outerHTML"
              class="flex flex-col gap-2 rounded border border-neutral-200 p-2"
            >
              <div class="target hidden" />
              <Label for="username">Username</Label>
              <Input type="text" id="username" name="username" required />
              <Label for="password">Password</Label>
              <Input type="password" id="password" name="password" required />
              <Button>Login</Button>
              <Link href="/forgot">Forgot your password?</Link>
              <Link href="/register?then=%2Flogin">Create an account</Link>
            </form>
          </div>
        </Layout>
      );
    },
    {
      query: t.Object({
        then: t.Optional(t.String()),
      }),
    },
  )
  .post(
    "/login",
    async ({
      jwt,
      cookie: {auth},
      query: {then = "/"},
      body: {username, password},
      set,
    }) => {
      const response = await sql`SELECT * FROM account WHERE username = ${username}`;
      let error;
      if (response.length == 0 || response[0].password !== password) {
        error = "Username or password is incorrect.";
      }
      if (error) {
        return (
          <div class="target rounded bg-red-50 px-2 py-1 text-red-500">{error}</div>
        );
      }
      console.log(response);
      auth.set({
        value: await jwt.sign({
          userID: response[0].id,
          username: response[0].username,
        }),
      });
      set.headers["HX-Retarget"] = "this";
      return (
        <div
          class="m-4 flex flex-col gap-2"
          _="on load wait 1s then set window.location to @data-then of me"
          data-then={then}
        >
          <h1 class="text-xl">Login successful!</h1>
          <Link href={then}>Click here if not redirected.</Link>
        </div>
      );
    },
    {
      query: t.Object({
        then: t.Optional(t.String()),
      }),
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
    },
  );
