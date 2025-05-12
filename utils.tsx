import clsx from "clsx";
import {twMerge} from "tailwind-merge";

export function unwrap<T>(value: T | undefined | null, message?: string): T {
  if (value === undefined || value === null) {
    throw new Error(message ?? "Unwrap failed");
  }
  return value;
}

export function cn(
  ...inputs: (
    | string
    | false
    | (string | number | boolean | null | undefined)[]
    | undefined
  )[]
) {
  return twMerge(clsx(...inputs));
}
