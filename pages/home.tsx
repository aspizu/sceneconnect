import {Html} from "@elysiajs/html";
import {formatDistanceToNow} from "date-fns";
import Elysia from "elysia";
import {base} from "../base";
import {Link} from "../components/link";
import {Votes} from "../components/votes";
import {sql} from "../database";
import {Layout} from "../layouts/layout";

export const home = new Elysia({name: "page.home"})
  .use(base)
  .get("/", async ({jwt, cookie: {auth}}) => {
    const session = (await jwt.verify(auth.value)) || undefined;
    const response = await sql`
    select
      (
        select
          count(*)
        from
          post_vote
        where
          post = post.id
          and positive = true
      ) - (
        select
          count(*)
        from
          post_vote
        where
          post = post.id
          and positive = false
      ) as votes,
      href,
      title,
      post.created_at,
      username,
      positive,
      post.id as id
    from
      post
      join account on account.id = 1
      join post_vote on voter = 1
    order by
      post.created_at desc;`;
    return (
      <Layout session={session}>
        <div class="flex flex-col gap-2 p-4">
          {response.map((post: any) => (
            <div class="flex gap-4 border-b border-neutral-200 p-2">
              <Votes post_id={post.id} vote={post.positive ? "positive" : "negative"} />
              <div class="flex flex-col gap-2">
                <div>
                  <Link class="text-lg font-normal" href={post.href}>
                    {post.title}
                  </Link>
                </div>
                <div class="flex gap-2 text-sm text-neutral-500">
                  <span class="font-semibold">{post.votes} points</span>
                  <Link href={`/post/${post.id}`} class="text-neutral-500">
                    comments
                  </Link>
                  <span class="font-semibold">{post.username}</span>
                  <span>{formatDistanceToNow(post.created_at)} ago</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Layout>
    );
  });
