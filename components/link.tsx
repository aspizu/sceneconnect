import {Html} from "@elysiajs/html";
import {cn} from "../utils";

export function Link(props: JSX.HtmlAnchorTag) {
  return (
    <a
      {...props}
      class={cn(
        "font-semibold text-neutral-900 underline hover:text-neutral-800",
        props.class,
      )}
    >
      {props.children}
    </a>
  );
}
