import { cookieConfig } from "../config/serverConfig.js";
import { UserRepository } from "../repositories/index.js";
import AuthService from "../services/authService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";

const authService = new AuthService(new UserRepository());

export const register = asyncHandler(async function (req, res) {
  const { user, accessToken, refreshToken } = await authService.register(
    req.body
  );

  res.cookie("accessToken", accessToken, cookieConfig);
  res.cookie("refreshToken", refreshToken, cookieConfig);
  sendSuccess(
    res,
    { user, accessToken, refreshToken },
    "User registered successfully",
    201
  );
});

export const login = asyncHandler(async function (req, res) {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.login(
    email,
    password
  );
  res.cookie("accessToken", accessToken, cookieConfig);
  res.cookie("refreshToken", refreshToken, cookieConfig);

  sendSuccess(
    res,
    { user, accessToken, refreshToken },
    "Login successful",
    200
  );
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  const { newAccessToken, newRefreshToken } =
    await authService.refreshAccessToken(refreshToken);

  res.cookie("accessToken", newAccessToken, cookieConfig);
  res.cookie("refreshToken", newRefreshToken, cookieConfig);

  sendSuccess(
    res,
    { newAccessToken, newRefreshToken },
    "Token refreshed successfully",
    200
  );
});

export const logout = asyncHandler(async function (req, res) {
  const refreshToken = req.cookies.refreshToken;
  await authService.logout(req.user.id, refreshToken);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  sendSuccess(res, true, "Logout Successful", 200);
});
