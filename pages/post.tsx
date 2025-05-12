import {Html} from "@elysiajs/html";
import {formatDistanceToNow} from "date-fns";
import Elysia, {status, t} from "elysia";
import {base} from "../base";
import {Button} from "../components/button";
import {Link} from "../components/link";
import {Votes} from "../components/votes";
import {sql} from "../database";
import {Layout} from "../layouts/layout";

function Comment({
  content,
  username,
  created_at,
}: {
  content: string;
  username: string;
  created_at: Date;
}) {
  return (
    <div class="border-b border-gray-200 py-4">
      <p class="text-gray-800">{content}</p>
      <div class="mt-2 text-sm text-gray-500">
        <span>{username}</span> ·{" "}
        <span>{formatDistanceToNow(created_at, {addSuffix: true})}</span>
      </div>
    </div>
  );
}

export const post = new Elysia({name: "page.post"})
  .use(base)
  .get(
    "/post/:id",
    async ({jwt, cookie: {auth}, params: {id}, set}) => {
      const session = (await jwt.verify(auth.value)) || undefined;
      const response = await sql`
        SELECT post.*, account.username FROM post
        JOIN account ON post.author = account.id
        WHERE post.id = ${id}
      `;

      if (response.length === 0) {
        set.status = 404;
        return (
          <Layout title="Post not found" session={session}>
            <h1 class="text-xl">Post not found</h1>
          </Layout>
        );
      }

      const post = response[0];

      const comments = await sql`
        SELECT
          (
            SELECT count(*) FROM comment_vote
            WHERE comment = comment.id AND positive = true
          ) - (
            SELECT count(*) FROM comment_vote
            WHERE comment = comment.id AND positive = false
          ) AS votes,
          content,
          comment.created_at,
          account.username
        FROM comment
        JOIN account ON account.id = comment.author
        WHERE comment.post = ${id}
        ORDER BY comment.created_at DESC
      `;

      return (
        <Layout title={post.title} session={session}>
          <div class="flex flex-col p-4">
            <Link class="text-lg font-semibold" href={post.href}>
              {post.title}
            </Link>
            <p class="mb-4 text-gray-700">{post.content}</p>
            <div class="mb-6">
              <form
                hx-post={`/post/${post.id}/comment`}
                hx-target=".comments"
                class="flex flex-col gap-2"
              >
                <div class="target hidden" />
                <textarea
                  name="content"
                  required
                  class="rounded-md border border-neutral-300 p-2 focus:border-neutral-500 focus:outline-none"
                  placeholder="Add a comment..."
                />
                <Button>Comment</Button>
              </form>
            </div>
            <div class="comments flex flex-col gap-4">
              {comments.map((comment: any) => (
                <Comment
                  content={comment.content}
                  username={comment.username}
                  created_at={comment.created_at}
                />
              ))}
            </div>
          </div>
        </Layout>
      );
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
    },
  )
  .post(
    "/post/:id/comment",
    async ({jwt, cookie: {auth}, params: {id}, body: {content, reply}, set}) => {
      const session = await jwt.verify(auth.value);

      if (!session) {
        return status(401);
      }

      let error: string | null = null;

      if (!content || content.trim() === "") {
        error = "Comment cannot be empty.";
      }

      if (error) {
        return (
          <div class="target rounded bg-red-50 px-2 py-1 text-red-500">{error}</div>
        );
      }

      await sql`
        INSERT INTO comment (post, author, content, reply)
        VALUES (${id}, ${session.userID}, ${content}, ${reply ?? null})
      `;

      const [newComment] = await sql`
        SELECT content, comment.created_at, account.username
        FROM comment
        JOIN account ON comment.author = account.id
        WHERE comment.post = ${id}
        ORDER BY comment.created_at DESC
        LIMIT 1
      `;

      set.headers["HX-Retarget"] = ".comments";
      set.headers["HX-Reswap"] = "afterbegin";

      return (
        <Comment
          content={newComment.content}
          username={newComment.username}
          created_at={newComment.created_at}
        />
      );
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      body: t.Object({
        content: t.String(),
        reply: t.Optional(t.Number()),
      }),
    },
  )
  .post(
    "/post/:id/upvote",
    async ({jwt, cookie: {auth}, params: {id}}) => {
      const session = await jwt.verify(auth.value);
      if (!session) {
        return status(401);
      }
      try {
        await sql`
          DELETE FROM post_vote
          WHERE post = ${id} AND voter = ${session.userID} AND positive = false
        `.execute();
      } catch (e) {
        console.error(e);
        return status(500);
      }
      try {
        await sql`
          INSERT INTO post_vote (post, voter, positive)
          VALUES (${id}, ${session.userID}, true)
          ON CONFLICT (post, voter) DO UPDATE SET positive = true
        `.execute();
      } catch (e) {
        console.error(e);
        return status(500);
      }
      return <Votes post_id={id} vote="positive" />;
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
    },
  )
  .post(
    "/post/:id/downvote",
    async ({jwt, cookie: {auth}, params: {id}}) => {
      const session = await jwt.verify(auth.value);
      if (!session) {
        return status(401);
      }
      try {
        await sql`
          DELETE FROM post_vote
          WHERE post = ${id} AND voter = ${session.userID} AND positive = true
        `.execute();
      } catch (e) {
        console.error(e);
        return status(500);
      }
      try {
        await sql`
          INSERT INTO post_vote (post, voter, positive)
          VALUES (${id}, ${session.userID}, false)
          ON CONFLICT (post, voter) DO UPDATE SET positive = false
        `.execute();
      } catch (e) {
        console.error(e);
        return status(500);
      }
      return <Votes post_id={id} vote="negative" />;
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
    },
  );
