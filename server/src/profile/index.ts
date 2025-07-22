import Elysia from "elysia";
import { authPlugin } from "@/plugins/authPlugin";
import { profileResponseSchema } from "@/profile/model";
import { getUser } from "@/profile/service";

export const profile = new Elysia().use(authPlugin).get("/profile", ({ userId }) => getUser({ userId }), { authenticated: true, response: profileResponseSchema });
