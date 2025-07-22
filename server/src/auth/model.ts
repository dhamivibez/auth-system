import { t } from "elysia";

export const errorResponse = t.Object({
	success: t.Boolean(),
	message: t.String(),
});

export const signupSchema = t.Object({
	firstName: t.String({ minLength: 1, error: "First name is required" }),
	lastName: t.Optional(t.String()),
	username: t.String({
		minLength: 3,
		maxLength: 30,
		error: "Username must be 3–30 letters",
	}),
	email: t.String({ format: "email", error: "Invalid email address" }),
	password: t.String({ minLength: 6, error: "Password should be at least six characters" }),
});

export type SignupSchema = typeof signupSchema.static;

export const signupResponseSchema = {
	200: t.Object({
		success: t.Boolean(),
	}),
	400: errorResponse,
	422: errorResponse,
	500: errorResponse,
};
