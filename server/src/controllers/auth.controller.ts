import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { loginUser } from "../services/auth.service";
import pool from "../config/database";

import type { AuthenticatedRequest } from "../middleware/auth.middleware";

const JWT_SECRET =
  process.env.JWT_SECRET || "rmc-pro-secret";

/* ================================================= */
/* LOGIN                                             */
/* ================================================= */

export async function login(
  req: Request,
  res: Response
) {
  try {
    const { username, password } =
      req.body || {};

    if (!username || !password) {
      return res.status(400).json({
        message:
          "Username and password are required",
      });
    }

    const user = await loginUser(
      username,
      password
    );

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(401).json({
      message:
        "Invalid username or password",
    });
  }
}

/* ================================================= */
/* CHANGE OWN PASSWORD                               */
/* ================================================= */

export async function changePassword(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const {
      currentPassword,
      newPassword,
    } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message:
          "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "New password must be at least 6 characters",
      });
    }

    const result = await pool.query(
      `
      SELECT id, password_hash
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = result.rows[0];

    const passwordMatch =
      await bcrypt.compare(
        currentPassword,
        user.password_hash
      );

    if (!passwordMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const samePassword =
      await bcrypt.compare(
        newPassword,
        user.password_hash
      );

    if (samePassword) {
      return res.status(400).json({
        message:
          "New password must be different from current password",
      });
    }

    const newPasswordHash =
      await bcrypt.hash(newPassword, 10);

    await pool.query(
      `
      UPDATE users
      SET password_hash = $1
      WHERE id = $2
      `,
      [newPasswordHash, userId]
    );

    return res.status(200).json({
      message:
        "Password changed successfully",
    });
  } catch (error) {
    console.error(
      "Change password error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to change password",
    });
  }
}

/* ================================================= */
/* ADMIN CHANGE USER PASSWORD                        */
/* ================================================= */

export async function changeUserPassword(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = Number(req.params.id);

    if (!userId || Number.isNaN(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const { newPassword } =
      req.body || {};

    if (!newPassword) {
      return res.status(400).json({
        message: "New password is required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "New password must be at least 6 characters",
      });
    }

    const userResult = await pool.query(
      `
      SELECT id, username
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const newPasswordHash =
      await bcrypt.hash(newPassword, 10);

    await pool.query(
      `
      UPDATE users
      SET password_hash = $1
      WHERE id = $2
      `,
      [newPasswordHash, userId]
    );

    return res.status(200).json({
      message:
        `Password updated for ${userResult.rows[0].username}`,
    });
  } catch (error) {
    console.error(
      "Admin password update error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update user password",
    });
  }
}