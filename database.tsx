import postgres from "postgres";
import * as environment from "./environment";

export const sql = postgres(environment.DATABASE);
