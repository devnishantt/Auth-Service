import { Router } from "express";
import { validateRequestBody } from "../../validators/index.js";
import {
  changePasswordSchema,
  deleteAccountSchema,
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "../../validators/authValidator.js";
import {
  changePassword,
  deleteAccount,
  getProfile,
  login,
  logout,
  refreshAccessToken,
  register,
  updateProfile,
} from "../../controllers/authController.js";
import authenticate from "../../middlewares/authMiddleware.js";

const authRouter = Router();

authRouter.post("/register", validateRequestBody(registerSchema), register);
authRouter.post("/login", validateRequestBody(loginSchema), login);
authRouter.post("/refresh-token", refreshAccessToken);
authRouter.post("/logout", authenticate, logout);
authRouter.get("/profile", authenticate, getProfile);
authRouter.patch(
  "/update",
  authenticate,
  validateRequestBody(updateProfileSchema),
  updateProfile
);
authRouter.post(
  "/change-password",
  authenticate,
  validateRequestBody(changePasswordSchema),
  changePassword
);
authRouter.delete(
  "/delete",
  authenticate,
  validateRequestBody(deleteAccountSchema),
  deleteAccount
);
export default authRouter;
