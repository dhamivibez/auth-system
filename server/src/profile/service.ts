import { eq } from "drizzle-orm";
import { status } from "elysia";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import type { UpdateProfileSchema } from "@/profile/model";

export const getProfile = async ({ userId }: { userId: string }) => {
	const data = await db.query.users.findFirst({ where: eq(users.id, userId), columns: { firstName: true, lastName: true, username: true, email: true, lastLogin: true } });
	if (!data) {
		throw status(404, "User proile not found");
	}
	return { success: true, data };
};
export const updateProfile = async ({ body, userId }: { body: UpdateProfileSchema; userId: string }) => {
	const { username, email, firstName, lastName } = body;

	await db
		.update(users)
		.set({ username: username || users.username, email: email || users.email, firstName: firstName || users.firstName, lastName: lastName ?? users.lastName })
		.where(eq(users.id, userId));

	return { success: true };
};
