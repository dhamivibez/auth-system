import { Elysia } from "elysia";

export const app = new Elysia().get("/", () => "A full auth system").listen(3000);
