if (!process.env.DATABASE_URL) {
	throw new Error("No database url found");
}

export const DATABASE_URL = process.env.DATABASE_URL;
export const CORS_ORIGIN = process.env.CORS_ORIGIN;
