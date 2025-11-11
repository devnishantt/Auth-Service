import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/index.js";
import { jwtConfig } from "../config/serverConfig";
import {
  ForbiddenError,
  InternalServerError,
  UnauthorizedError,
} from "./errors";

const userRepository = new UserRepository();

export async function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, jwtConfig.JWT_SECRET, {
    expiresIn: jwtConfig.JWT_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(payload, jwtConfig.JWT_REFRESH_SECRET, {
    expiresIn: jwtConfig.JWT_REFRESH_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
}

export async function verifyAccessToken(token) {
  try {
    if (!token) {
      throw new UnauthorizedError("No token provided");
    }
    const decoded = jwt.verify(token, jwtConfig.JWT_SECRET);
    if (!decoded || !decoded.id) {
      throw new UnauthorizedError("Invalid token payload");
    }

    const user = await userRepository.findById(decoded.id);
    if (!user) {
      throw new UnauthorizedError("User not found");
    }
    if (!user.isActive) {
      throw new ForbiddenError("User account is deactivated");
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError("Invalid or malformed token");
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError("Token has expired");
    }
    if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
      throw error;
    }
    throw new InternalServerError("Error verifying access token");
  }
}
