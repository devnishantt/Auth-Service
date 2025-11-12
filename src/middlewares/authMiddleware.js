import { sendError } from "../utils/response.js";
import { verifyAccessToken } from "../utils/tokenUtils.js";

export default async function authenticate(req, res, next) {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    sendError(res, "Access token is required", 401);
  }

  const decoded = await verifyAccessToken(token);

  req.user = decoded;
  next();
}
