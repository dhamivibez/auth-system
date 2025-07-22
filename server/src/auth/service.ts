import { status } from "elysia";
import type { SignupSchema } from "@/auth/model";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { checkUser, hashPassword } from "@/utils/auth";

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
