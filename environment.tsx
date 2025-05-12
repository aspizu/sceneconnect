import {unwrap} from "./utils";

export const HOSTNAME = unwrap(process.env.HOSTNAME, "HOSTNAME must be set");
export const PORT = unwrap(process.env.PORT, "PORT must be set");
export const DATABASE = unwrap(process.env.DATABASE, "DATABASE must be set");
export const JWT_SECRET = unwrap(process.env.JWT_SECRET, "JWT_SECRET must be set");
export const LOG_LEVEL = unwrap(process.env.LOG_LEVEL, "LOG_LEVEL must be set");
