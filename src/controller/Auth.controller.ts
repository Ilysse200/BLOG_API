import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { encrypt } from "../helpers/helpers";
import { sendEmail } from "../utils/sendEmail";

import { MoreThan } from "typeorm";
import crypto from "crypto";

export class AuthController {
  //Register the user
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields required" });
      }

      const userRepository = AppDataSource.getRepository(User);
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }

      const hashedPassword = await encrypt.encryptpass(password);
      const user = userRepository.create({ name, email, password: hashedPassword, role });
      await userRepository.save(user);

      const token = encrypt.generateToken({ id: user.id, email: user.email, role: user.role });
      return res.status(201).json({ message: "User created", token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(500)
          .json({ message: " email and password required" });
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email } });

      // ❗ FIX: Check user existence BEFORE using user.password
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = encrypt.comparepassword(user.password, password);
      if (!user || !isPasswordValid) {
        return res.status(404).json({ message: "User not found" });
      }
      const token = encrypt.generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        message: "Login successful",
        token,
        user: userWithoutPassword
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getProfile(req: Request, res: Response) {
    const currentUser = (req as any).currentUser;
    if (!currentUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: currentUser.id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json(userWithoutPassword);
  }
  //Forgot Password
  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "Email required" });

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: "User not found" });

      const token = crypto.randomBytes(32).toString("hex");

      user.resetToken = token;
      user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
      await userRepository.save(user);

      const resetLink = `http://localhost:3000/reset-password/${token}`;

      await sendEmail(
        user.email,
        "Reset Your Password",
        `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`
      );

      res.status(200).json({ message: "Reset link sent to email." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  static async resetPassword(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: {
          resetToken: token,
          resetTokenExpiry: MoreThan(new Date()),
        },
      });

      if (!user) return res.status(400).json({ message: "Invalid or expired token" });
      if (!newPassword || newPassword.trim() === "") {
        return res.status(400).json({ message: "New password is required." });
      }
      

      user.password = await encrypt.encryptpass(newPassword);
      user.resetToken = null;
      user.resetTokenExpiry = null;

      await userRepository.save(user);

      res.status(200).json({ message: "Password reset successfully." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

}