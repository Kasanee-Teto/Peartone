import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import ApiError from "../utils/apiError.js";
import BaseService from "./base.service.js";

const { User } = db;

class AuthService extends BaseService {
  async register({ email, password }) {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      throw new ApiError(409, "Email already registered");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, role: "user" });

    const token = this._signToken(user);
    return this.success(
      {
        user: this._sanitizeUser(user),
        token
      },
      "User registered"
    );
  }

  async login({ email, password }) {
    const user = await User.findOne({ where: { email } });
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
      "Login successful"
    );
  }

  _signToken(user) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET must be set");
    }
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret,
    );
  }

  _sanitizeUser(user) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}

export default new AuthService();