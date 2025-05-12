import {Html} from "@elysiajs/html";
import {cn} from "../utils";

export function Button(props: JSX.HtmlButtonTag) {
  return (
    <button
      {...props}
      class={cn(
        "rounded bg-neutral-950 px-2 py-1 font-semibold text-white shadow-xs hover:bg-neutral-900 focus:outline-none",
        props.class,
      )}
    >
      {props.children}
    </button>
  );
}
