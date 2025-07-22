import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia, status } from "elysia";
import { CORS_ORIGIN } from "env";
import { auth } from "@/auth";

export const app = new Elysia()
	.onError(({ code, error }) => {
		if (typeof code === "number") {
			return status(code, { success: false, message: error.response });
		}

		if (code === "VALIDATION") {
			const firstError = error.all[0];

			return status(422, {
				success: false,
				message: firstError?.summary !== undefined ? (firstError.schema?.error ?? "Validation Failed") : "Validation failed",
			});
		}

		return status(500, { success: false, message: "An unexpected error occurred." });
	})
	.use(swagger({ path: "/docs", documentation: { info: { title: "Auth system", version: "1.0.0" } } }))
	.use(cors({ origin: CORS_ORIGIN }))
	.get("/", () => "A full auth system")
	.use(auth)
	.listen(3000);
