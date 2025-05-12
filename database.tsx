import {SQL} from "bun";
import * as environment from "./environment";

export const sql = new SQL({url: environment.DATABASE});
