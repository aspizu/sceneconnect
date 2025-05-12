import {Html} from "@elysiajs/html";
import type {JWTSchema} from "../schemas";
import {cn} from "../utils";

cn("bg-neutral-100");

function HeaderLink(props: JSX.HtmlAnchorTag) {
  return (
    <a
      {...props}
      class={cn("block px-3 py-2 hover:bg-neutral-100", props.class)}
      _="on load if @href of me is window.location.pathname then add .bg-neutral-100 to me"
    >
      {props.children}
    </a>
  );
}

export function Header({session}: {session?: JWTSchema}) {
  return (
    <header class="flex border-b border-neutral-200 pr-[32px] font-semibold">
      <img src="/public/sceneconnect.png" class="mr-auto h-[31px]" />
      <HeaderLink href="/">Home</HeaderLink>
      <HeaderLink href="/submit">Submit</HeaderLink>
      {session ?
        <HeaderLink href="/settings">Settings</HeaderLink>
      : <HeaderLink href="/login">Login</HeaderLink>}
    </header>
  );
}
