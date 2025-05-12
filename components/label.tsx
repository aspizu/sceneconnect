import {Html} from "@elysiajs/html";
import {cn} from "../utils";

export function Label(props: JSX.HtmlLabelTag) {
  return (
    <label {...props} class={cn("text-sm font-semibold", props.class)}>
      {props.children}
    </label>
  );
}
