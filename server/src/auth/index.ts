import Elysia from "elysia";
import { signupResponseSchema, signupSchema } from "@/auth/model";
import { signup } from "@/auth/service";

export const auth = new Elysia({ prefix: "/auth" }).post("/signup", ({ body }) => signup({ body }), { body: signupSchema, response: signupResponseSchema });
