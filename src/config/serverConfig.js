import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const LOG_LEVEL = process.env.LOG_LEVEL;

export const dbConfig = {
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "root",
  DB_NAME: process.env.DB_NAME || "auth_db",
};

export const jwtConfig = {
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-jwt-key",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || "your-secret-refresh-key",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
};

export const cookieConfig = {
  COOKIE_MAX_AGE: Number.parseInt(
    process.env.COOKIE_MAX_AGE || "604800000",
    10
  ),
  HTTP_ONLY: true,
  SECURE: process.env.NODE_ENV === "production",
  sameSite: "strict",
};
