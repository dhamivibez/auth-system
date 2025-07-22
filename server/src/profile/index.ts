import Elysia from "elysia";
import { authPlugin } from "@/plugins/authPlugin";
import { profileResponseSchema, updateProfileSchema } from "@/profile/model";
import { getProfile, updateProfile } from "@/profile/service";

export const profile = new Elysia()
	.use(authPlugin)
	.get("/profile", ({ userId }) => getProfile({ userId }), { authenticated: true, response: profileResponseSchema })
	.put("/profile", ({ body, userId }) => updateProfile({ body, userId }), { body: updateProfileSchema, authenticated: true });
