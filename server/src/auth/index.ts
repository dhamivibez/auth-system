import Elysia from "elysia";
import { authResponseSchema, loginSchema, logoutResponseSchema, signupSchema } from "@/auth/model";
import { login, signup } from "@/auth/service";
import { jwtPlugin } from "@/plugins/jwtPlugin";
import { deleteRefreshToken } from "@/utils/auth";

export const auth = new Elysia({ prefix: "/auth" })
	.use(jwtPlugin)
	.post("/signup", ({ body }) => signup({ body }), { body: signupSchema, response: authResponseSchema })
	.post(
		"/login",
		async ({ body, request, jwt, cookie }) => {
			const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "";
			const userAgent = request.headers.get("user-agent") ?? "";

			const { userId, refreshToken } = await login({ body, ipAddress, userAgent });

			const token = await jwt.sign({ sub: userId, exp: "15m" });

			cookie["__Secure-access-token"]?.set({
				value: token,
				httpOnly: true,
				secure: true,
				sameSite: "none",
				path: "/",
				maxAge: 15 * 60 * 1000,
			});

			cookie["__Secure-refresh-token"]?.set({
				value: refreshToken,
				httpOnly: true,
				secure: true,
				sameSite: "none",
				path: "/",
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});

			return { success: true };
		},
		{ body: loginSchema, response: authResponseSchema },
	)
	.post(
		"/logout",
		async ({ cookie }) => {
			const refreshToken = cookie["__Secure-refresh-token"];

			if (!refreshToken) {
				return { success: true };
			}

			if (refreshToken.value) await deleteRefreshToken(refreshToken.value);

			cookie["__Secure-access-token"]?.set({
				value: "",
				expires: new Date(0),
				httpOnly: true,
				secure: true,
				sameSite: "none",
				path: "/",
			});
			cookie["__Secure-refresh-token"]?.set({
				value: "",
				expires: new Date(0),
				httpOnly: true,
				secure: true,
				sameSite: "none",
				path: "/",
			});

			return { success: true };
		},
		{
			authenticated: true,
			response: logoutResponseSchema,
		},
	);
