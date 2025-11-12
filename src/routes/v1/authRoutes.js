import { Router } from "express";
import { validateRequestBody } from "../../validators/index.js";
import { loginSchema, registerSchema } from "../../validators/authValidator.js";
import { login, refreshAccessToken, register } from "../../controllers/authController.js";

const authRouter = Router();

authRouter.post("/register", validateRequestBody(registerSchema), register);
authRouter.post("/login", validateRequestBody(loginSchema), login);
authRouter.post("/refresh-token", refreshAccessToken)
export default authRouter;
