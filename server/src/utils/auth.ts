import { hash } from "argon2";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { users } from "@/db/schema";

export const checkUser = async ({ email, username }: { email: string; username: string }) => {
	const [emailUser, usernameUser] = await Promise.all([db.query.users.findFirst({ where: eq(users.email, email) }), db.query.users.findFirst({ where: eq(users.username, username) })]);

	if (emailUser) return { name: "Email" };

	if (usernameUser) return { name: "Username" };

	return null;
};

export const hashPassword = async (password: string) => {
	return await hash(password);
};
