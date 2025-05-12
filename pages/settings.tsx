import {Html} from "@elysiajs/html";
import Elysia, {redirect, status, t} from "elysia";
import {base} from "../base";
import {Button} from "../components/button";
import {Input} from "../components/input";
import {Label} from "../components/label";
import {sql} from "../database";
import {Layout} from "../layouts/layout";

export const settings = new Elysia({name: "page.settings"})
  .use(base)
  .get("/settings", async ({jwt, cookie: {auth}}) => {
    const session = (await jwt.verify(auth.value)) || undefined;
    if (!session) {
      return redirect("/login");
    }
    return (
      <Layout session={session}>
        <div class="flex flex-col gap-2 p-4">
          <h1 class="text-xl">Settings</h1>
          <form
            class="flex flex-col gap-2 rounded border border-neutral-200 p-2"
            hx-post="/change-password"
            hx-target=".target"
            hx-swap="outerHTML"
          >
            <div class="target hidden" />
            <Label for="oldPassword">Old Password</Label>
            <Input type="password" id="oldPassword" name="oldPassword" required />
            <Label for="newPassword">New Password</Label>
            <Input type="password" id="newPassword" name="newPassword" required />
            <Label for="newPasswordAgain">New Password Again</Label>
            <Input
              type="password"
              id="newPasswordAgain"
              name="newPasswordAgain"
              required
            />
            <Button>Change Password</Button>
          </form>
        </div>
      </Layout>
    );
  })
  .post(
    "/change-password",
    async ({
      jwt,
      cookie: {auth},
      body: {oldPassword, newPassword, newPasswordAgain},
      set,
    }) => {
      const session = await jwt.verify(auth.value);
      if (!session) {
        return status(401);
      }

      let error;
      if (newPassword !== newPasswordAgain) {
        error = "New passwords do not match.";
      } else if (newPassword.length < 8) {
        error = "New password must be at least 8 characters long.";
      } else {
        const response = await sql`SELECT * FROM account WHERE id = ${session.userID}`;
        if (response.length == 0) {
          return status(404);
        }
        if (response[0].password !== oldPassword) {
          error = "Old password is incorrect.";
        } else {
          await sql`UPDATE account SET password = ${newPassword} WHERE id = ${session.userID}`.execute();
        }
      }

      if (error) {
        return (
          <div class="target rounded bg-red-50 px-2 py-1 text-red-500">{error}</div>
        );
      }

      set.headers["HX-Retarget"] = "this";

      return (
        <div class="target rounded bg-green-50 px-2 py-1 text-green-500">
          Password changed successfully.
        </div>
      );
    },
    {
      body: t.Object({
        oldPassword: t.String(),
        newPassword: t.String(),
        newPasswordAgain: t.String(),
      }),
    },
  );
