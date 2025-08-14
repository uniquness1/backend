import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });
export const {
  PORT,
  NODE_ENV,
  DB_URI,
  JWT_SECRET,
  JWT_EXPIRE_TIME,
  ARCJET_KEY,
  ARCJET_ENV,
  EMAIL_PASSWORD,
  EMAIL_NAME,
  FRONTEND_URL,
  REFRESH_TOKEN_SECRET,
} = process.env;
