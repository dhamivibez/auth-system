import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { refreshTokens, users } from "@/db/schema";
import { hashRefreshToken } from "@/utils/auth";

export const getUserById = async (userId: string) => {
	const user = await db.query.users.findFirst({
		where: eq(users.id, userId),
		columns: { id: true },
	});

	return user;
};

export const validateRefreshToken = async (refreshToken: string) => {
	const hashedRefreshToken = hashRefreshToken(refreshToken);
	const storedRefreshToken = await db.query.refreshTokens.findFirst({
		where: eq(refreshTokens.token, hashedRefreshToken),
		columns: { userId: true, expiresAt: true, token: true },
	});

	if (!storedRefreshToken) {
		return null;
	}

	if (new Date() > storedRefreshToken.expiresAt) {
		await db.delete(refreshTokens).where(eq(refreshTokens.token, hashedRefreshToken));
		return null;
	}

	return storedRefreshToken.userId;
};
