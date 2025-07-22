import { t } from "elysia";
import { errorResponse } from "@/auth/model";

export const profileSchema = t.Object({
	firstName: t.String(),
	lastName: t.Nullable(t.String()),
	email: t.String(),
	username: t.String(),
	lastLogin: t.Nullable(t.Date()),
});

export const profileResponseSchema = {
	200: t.Object({
		success: t.Boolean(),
		data: profileSchema,
	}),
	400: errorResponse,
	404: errorResponse,
	500: errorResponse,
};

export const updateProfileSchema = t.Object({
	username: t.Optional(t.String({ error: "Invalid username" })),
	email: t.Optional(t.String({ format: "email", error: "Invalid Email" })),
	firstName: t.Optional(t.String()),
	lastName: t.Optional(t.String()),
});

export type UpdateProfileSchema = typeof updateProfileSchema.static;
