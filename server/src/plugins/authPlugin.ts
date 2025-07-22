import Elysia, { status } from "elysia";
import { jwtPlugin } from "@/plugins/jwtPlugin";
import { getUserById, validateRefreshToken } from "@/utils/user";

export const authPlugin = new Elysia().use(jwtPlugin).macro({
	authenticated: {
		async resolve({ jwt, cookie }) {
			const authToken = cookie["__Secure-access-token"]?.value;
			const refreshToken = cookie["__Secure-refresh-token"]?.value;

			if (!authToken && !refreshToken) {
				throw status(401, "Please log in to continue");
			}

			const jwtPayload = await jwt.verify(authToken);

			if (jwtPayload) {
				if (!jwtPayload.sub) {
					throw status(401, "Session Expired");
				}

				return {
					userId: jwtPayload.sub,
				};
			}

			if (refreshToken) {
				const userId = await validateRefreshToken(refreshToken);
				if (!userId) {
					throw status(401, "Session expired. Please log in again");
				}

				const user = await getUserById(userId);

				if (!user || !user.id) {
					throw status(401, "Account not found. Please log in again");
				}

				const token = await jwt.sign({
					sub: user.id,
					exp: "15m",
				});

				cookie["__Secure-access-token"]?.set({
					value: token,
					httpOnly: true,
					secure: true,
					sameSite: "none",
					maxAge: 15 * 60,
				});

				return {
					userId: user.id,
				};
			}

			throw status(401, "Authentication failed. Please log in again");
		},
	},
});
