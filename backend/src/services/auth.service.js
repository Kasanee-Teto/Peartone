import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import ApiError from "../utils/apiError.js";
import { validatePasswordStrength } from "../utils/passwordPolicy.js";
import BaseService from "./base.service.js";

const { User } = db;

class AuthService extends BaseService {
  async register({ username, email, password }) {
    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.ok) {
      throw new ApiError(400, passwordCheck.message);
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      throw new ApiError(409, "Username already registered");
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      throw new ApiError(409, "Email already registered");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash, role: "user" });

    const token = this._signToken(user);
    return this.success(
      {
        user: this._sanitizeUser(user),
        token
      },
      "User registered!"
    );
  }

  async login({ username, password }) {

    const user = await User.findOne({ where: { username } });
  
    if (!user) {
      throw new ApiError(401, "Invalid credentials"); 
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = this._signToken(user);
    return this.success(
      {
        user: this._sanitizeUser(user),
        token
      },
      "Login successful!"
    );
  }

  _signToken(user) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET must be set");
    }
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    return jwt.sign(payload, jwtSecret, {
      algorithm: "HS256",
      expiresIn: "7d",
      issuer: process.env.JWT_ISSUER || "Peartone API",
      audience: process.env.JWT_AUDIENCE || "Peartone Client"
    });
  }

  _sanitizeUser(user) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}

export default new AuthService();