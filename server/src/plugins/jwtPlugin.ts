import jwt from "@elysiajs/jwt";
import Elysia, { status } from "elysia";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
	throw status(500, "Internal Server Error");
}

export const jwtPlugin = new Elysia().use(
	jwt({
		name: "jwt",
		secret: JWT_SECRET,
	}),
);
