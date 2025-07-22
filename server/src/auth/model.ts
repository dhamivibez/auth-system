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

export const authResponseSchema = {
	200: t.Object({
		success: t.Boolean(),
	}),
	400: errorResponse,
	422: errorResponse,
	500: errorResponse,
};

export const loginSchema = t.Object({
	identifier: t.String({ minLength: 1, error: "Username or Email is required" }),
	password: t.String({ minLength: 6, error: "Password should be at least six characters" }),
});

export type LoginSchema = typeof loginSchema.static;

export const logoutResponseSchema = {
	200: t.Object({
		success: t.Boolean(),
	}),
	500: errorResponse,
};

export const resetPasswordSchema = t.Object({
	username: t.String({ minLength: 1, error: "Invalid Username" }),
	email: t.String({ format: "email", error: "Invalid Email" }),
	password: t.String({ minLength: 6, error: "Password should be at least six characters" }),
});

export type ResetPasswordSchema = typeof resetPasswordSchema.static;

export const resetPasswordResponseSchema = {
	200: t.Object({
		success: t.Boolean(),
	}),
	400: errorResponse,
	500: errorResponse,
};
