import { relations } from "drizzle-orm";
import { refreshTokens, users } from "@/db/schema";

export const userRelations = relations(users, ({ many }) => ({
	refreshTokens: many(refreshTokens),
}));

export const refreshTokenRelations = relations(refreshTokens, ({ one }) => ({
	user: one(users, {
		fields: [refreshTokens.userId],
		references: [users.id],
	}),
}));
