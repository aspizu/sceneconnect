import {Html} from "@elysiajs/html";
import Elysia, {t} from "elysia";
import {base} from "../base";
import {Button} from "../components/button";
import {Input} from "../components/input";
import {Label} from "../components/label";
import {Link} from "../components/link";
import {sql} from "../database";
import {Layout} from "../layouts/layout";

export const register = new Elysia({name: "page.register"})
  .use(base)
  .get(
    "/register",
    async ({jwt, cookie: {auth}}) => {
      const session = (await jwt.verify(auth.value)) || undefined;
      return (
        <Layout title="Register" session={session}>
          <form
            hx-post="/register"
            hx-target=".target"
            hx-swap="outerHTML"
            class="m-4 flex max-w-[400px] flex-col gap-2"
          >
            <h1 class="text-xl">Register</h1>
            <div class="target" />
            <Label for="email">Email</Label>
            <Input type="email" id="email" name="email" required />
            <Label for="username">Username</Label>
            <Input type="text" id="username" name="username" required />
            <Label for="password">Password</Label>
            <Input type="password" id="password" name="password" required />
            <Label for="passwordAgain">Password Again</Label>
            <Input type="password" id="passwordAgain" name="passwordAgain" required />
            <Button class="mt-4 max-w-32">Register</Button>
            <Link href="/forgot">Forgot your password?</Link>
            <Link href="/register">Create an account</Link>
          </form>
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
    "/register",
    async ({
      query: {then = "/"},
      body: {email, username, password, passwordAgain},
      set,
    }) => {
      const response = await sql`SELECT * FROM account WHERE username = ${username}`;
      let error;
      if (response.length == 1) {
        error = "That username is already taken.";
      } else if (password !== passwordAgain) {
        error = "Passwords do not match.";
      } else {
        await sql`INSERT INTO account (email, username, password) VALUES (${email}, ${username}, ${password})`.execute();
      }
      if (error) {
        return (
          <div class="target rounded bg-red-50 px-2 py-1 text-red-500">{error}</div>
        );
      }
      console.log(response);
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
        email: t.String(),
        username: t.String(),
        password: t.String(),
        passwordAgain: t.String(),
      }),
    },
  );
