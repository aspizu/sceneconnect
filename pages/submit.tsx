import {Html} from "@elysiajs/html";
import Elysia, {redirect, status, t} from "elysia";
import {base} from "../base";
import {Button} from "../components/button";
import {Input} from "../components/input";
import {Label} from "../components/label";
import {sql} from "../database";
import {Layout} from "../layouts/layout";

export const submit = new Elysia({name: "page.submit"})
  .use(base)
  .get("/submit", async ({jwt, cookie: {auth}}) => {
    const session = await jwt.verify(auth.value);
    if (!session) {
      return redirect("/login?then=%2Fsubmit");
    }
    return (
      <Layout session={session}>
        <div class="flex flex-col gap-2 p-4">
          <h1 class="text-xl">Submit</h1>
          <form
            class="flex flex-col gap-2 rounded border border-neutral-200 p-2"
            hx-post="/submit"
            hx-target=".target"
            hx-swap="outerHTML"
          >
            <div class="target hidden" />
            <Label for="url">URL</Label>
            <Input type="url" id="url" name="url" required />
            <Button>Submit</Button>
          </form>
        </div>
      </Layout>
    );
  })
  .post(
    "/submit",
    async ({jwt, cookie: {auth}, body: {url}}) => {
      const session = await jwt.verify(auth.value);
      if (!session) {
        return status(401);
      }

      let error = "";

      const pageResponse = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        },
      });

      let postID = null;

      if (
        !pageResponse.ok ||
        !pageResponse.headers.get("content-type")?.startsWith("text/html")
      ) {
        error = "Invalid URL.";
      } else {
        let pageTitle: string = "";

        await new HTMLRewriter()
          .on("title", {
            text(text) {
              pageTitle += text.text;
            },
          })
          .transform(pageResponse)
          .arrayBuffer();

        const response =
          await sql`INSERT INTO post (title, href, author) VALUES (${pageTitle.trim() || url}, ${url}, ${session.userID}) RETURNING id`;
        postID = response[0].id;
      }

      if (error) {
        return (
          <div class="target rounded bg-red-50 px-2 py-1 text-red-500">{error}</div>
        );
      }

      return redirect(`/post/${postID}`);
    },
    {
      body: t.Object({
        url: t.String(),
      }),
    },
  );
