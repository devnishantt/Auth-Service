import { Router } from "express";
import { validateRequestBody } from "../../validators.js";
import { registerSchema } from "../../validators/authValidator.js";

const authRouter = Router();

authRouter.post("/register", validateRequestBody(registerSchema), );
