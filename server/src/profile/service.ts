import { eq } from "drizzle-orm";
import { status } from "elysia";
import { db } from "@/db/db";
import { users } from "@/db/schema";

export const getUser = async ({ userId }: { userId: string }) => {
	const data = await db.query.users.findFirst({ where: eq(users.id, userId), columns: { firstName: true, lastName: true, username: true, email: true, lastLogin: true } });
	if (!data) {
		throw status(404, "User proile not found");
	}
	return { success: true, data };
};
