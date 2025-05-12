import {Html} from "@elysiajs/html";
import {Footer} from "../features/footer";
import {Header} from "../features/header";
import type {JWTSchema} from "../schemas";

export function Layout({
  session,
  title,
  children,
}: {
  session?: JWTSchema;
  title?: string;
  children?: any;
}) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ? `${title} - sceneconnect` : "sceneconnect"}</title>
        <link rel="stylesheet" href="/public/style.css" />
        <link rel="icon" href="/public/favicon.png" />
        <script src="https://unpkg.com/htmx.org@2.0.4" />
        <script src="https://unpkg.com/hyperscript.org@0.9.14" />
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body>
        <Header session={session} />
        <main class="flex max-w-[640px] flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
