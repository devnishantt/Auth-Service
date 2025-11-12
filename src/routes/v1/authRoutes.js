import { Router } from "express";
import { validateRequestBody } from "../../validators/index.js";
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
} from "../../validators/authValidator.js";
import {
  changePassword,
  getProfile,
  login,
  logout,
  refreshAccessToken,
  register,
} from "../../controllers/authController.js";
import authenticate from "../../middlewares/authMiddleware.js";

const authRouter = Router();

authRouter.post("/register", validateRequestBody(registerSchema), register);
authRouter.post("/login", validateRequestBody(loginSchema), login);
authRouter.post("/refresh-token", refreshAccessToken);
authRouter.post("/logout", authenticate, logout);
authRouter.get("/profile", authenticate, getProfile);

authRouter.post(
  "/change-password",
  authenticate,
  validateRequestBody(changePasswordSchema),
  changePassword
);
export default authRouter;
