import { drizzle } from "drizzle-orm/node-postgres";
import { DATABASE_URL } from "env";
import { refreshTokenRelations, userRelations } from "@/db/relations";
import { refreshTokens, users } from "@/db/schema";

export const db = drizzle(DATABASE_URL, { schema: { users, refreshTokens, userRelations, refreshTokenRelations } });
