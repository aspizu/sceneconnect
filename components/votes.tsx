import {Html} from "@elysiajs/html";
import {cn} from "../utils";

export function Votes({
  post_id,
  vote,
}: {
  post_id: number;
  vote?: "positive" | "negative";
}) {
  return (
    <div class="flex flex-col gap-2" hx-target="this">
      <button
        hx-post={`/post/${post_id}/upvote`}
        class={cn(
          "size-8 rounded-full hover:bg-neutral-100",
          vote === "positive" && "bg-green-200 hover:bg-green-100",
        )}
      >
        👍
      </button>
      <button
        hx-post={`/post/${post_id}/downvote`}
        class={cn(
          "size-8 rounded-full hover:bg-neutral-100",
          vote === "negative" && "bg-red-200 hover:bg-red-100",
        )}
      >
        👎
      </button>
    </div>
  );
}
