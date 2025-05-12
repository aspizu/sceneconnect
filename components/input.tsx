import {Html} from "@elysiajs/html";
import {cn} from "../utils";

export function Input(props: JSX.HtmlInputTag) {
  return (
    <input
      {...props}
      class={cn(
        "rounded border border-neutral-200 px-2 py-1 shadow-xs focus:border-neutral-400 focus:outline-none",
        props.class,
      )}
    />
  );
}
