import { createHash, randomBytes } from "node:crypto";
import { hash, verify } from "argon2";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { refreshTokens, users } from "@/db/schema";

export const checkUser = async ({ email, username }: { email: string; username: string }) => {
	const [emailUser, usernameUser] = await Promise.all([db.query.users.findFirst({ where: eq(users.email, email) }), db.query.users.findFirst({ where: eq(users.username, username) })]);

	if (emailUser) return { name: "Email" };

	if (usernameUser) return { name: "Username" };

	return null;
};

export const hashPassword = async (password: string) => {
	return await hash(password);
};

export const checkIdentifier = async (identifier: string) => {
	const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

	const user = await db.query.users.findFirst({
		where: isEmail ? eq(users.email, identifier) : eq(users.username, identifier),
	});

	return user;
};

export const verifyPassword = async (hashedPassword: string, password: string) => {
	return await verify(hashedPassword, password);
};

export const generateRefreshToken = () => {
	return randomBytes(32).toString("hex");
};

export const hashRefreshToken = (refreshToken: string) => {
	return createHash("sha256").update(refreshToken).digest("hex");
};

export const deleteRefreshToken = async (refreshToken: string) => {
	const hashed = hashRefreshToken(refreshToken);
	await db.delete(refreshTokens).where(eq(refreshTokens.token, hashed));
};
