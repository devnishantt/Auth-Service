import { UserRepository } from "../repositories/index.js";
import AuthService from "../services/authService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response";

const authService = new AuthService(new UserRepository());

export const register = asyncHandler(async function (req, res) {
  const result = await authService.register(req.body);
  sendSuccess(res, result, "User registered successfully", 201);
});
