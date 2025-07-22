import { status } from "elysia";
import type { LoginSchema, SignupSchema } from "@/auth/model";
import { db } from "@/db/db";
import { refreshTokens, users } from "@/db/schema";
import { checkIdentifier, checkUser, generateRefreshToken, hashPassword, hashRefreshToken, verifyPassword } from "@/utils/auth";

export const signup = async ({ body }: { body: SignupSchema }) => {
	const { email, lastName, username, firstName, password } = body;

	const taken = await checkUser({ email, username });

	if (taken) {
		throw status(400, `${taken.name} is already taken`);
	}

	const hashedPassword = await hashPassword(password);

	await db.insert(users).values({ firstName, lastName, email, username, password: hashedPassword });

	return { success: true };
};

export const login = async ({ body, ipAddress, userAgent }: { body: LoginSchema; ipAddress: string; userAgent: string }) => {
	const { identifier, password } = body;

	const user = await checkIdentifier(identifier);

	if (!user || !(await verifyPassword(user.password, password))) {
		throw status(400, "Invalid login details");
	}

	const refreshToken = generateRefreshToken();

	const hashedRefreshToken = hashRefreshToken(refreshToken);

	await db.insert(refreshTokens).values({
		userId: user.id,
		token: hashedRefreshToken,
		ipAddress,
		userAgent,
		expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
	});

	await db.update(users).set({ lastLogin: new Date() });

	return { userId: user.id, refreshToken };
};
