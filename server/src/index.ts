import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { CORS_ORIGIN } from "env";

export const app = new Elysia()
	.use(swagger({ path: "/docs", documentation: { info: { title: "Auth system", version: "1.0.0" } } }))
	.get("/", () => "A full auth system")
	.use(cors({ origin: CORS_ORIGIN }))
	.listen(3000);
