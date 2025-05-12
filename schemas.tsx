import type {Static} from "elysia";
import {t} from "elysia";

export const JWTSchema = t.Object({
  userID: t.Number({minimum: 0}),
  username: t.String(),
});

export type JWTSchema = Static<typeof JWTSchema>;
