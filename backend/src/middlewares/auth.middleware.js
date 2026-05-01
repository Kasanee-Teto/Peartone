import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return next(new ApiError(401, "Authentication token required"));
  }

  try {
    // Verify token and attach user info to request throw error if env variable is not set 
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET must be set");
    }
    const decoded = jwt.verify(token, jwtSecret, {
      algorithms: ["HS256"],
      issuer: process.env.JWT_ISSUER || "Peartone API",
      audience: process.env.JWT_AUDIENCE || "Peartone Client"
    });
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
    return next();
  } catch (err) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};

export default authMiddleware;