// services/AuthService.ts
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { encrypt } from "../helpers/helpers";
import { sendEmail } from "../utils/sendEmail";
import { MoreThan } from "typeorm";
import { RegisterValues } from "../types/auth.types";
import { ConflictError, NotFoundError, PasswordError } from "../utils/error";
import crypto from "crypto";

export class AuthService {
  static async register({name, email, password, role}:RegisterValues) {
  

    if (!name || !email || !password) {
      throw { status: 400, message: "All fields are required" };
    }

    const userRepository = AppDataSource.getRepository(User);

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictError("Email was registered in the database. Try a new one");
    }

    const hashedPassword = await encrypt.encryptpass(password);
    const user = userRepository.create({ name, email, password: hashedPassword, role });
    await userRepository.save(user);

    const token = encrypt.generateToken({ id: user.id, email: user.email, role: user.role });
    return {
      id:user,
      name:user.name,
      email:user.email,
      role:user.role,
    };
  }

  static async login(data:RegisterValues) {
    const { email, password } = data;

    if (!email || !password) {
      throw { status: 400, message: "Email and password are required" };
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isPasswordValid = await encrypt.comparepassword(password, user.password);
    if (!isPasswordValid) {
      throw new ConflictError("Password is incorrect");
    }

    const token = encrypt.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    user.resetToken = token;

    return user;
  }

  static async getProfile(userId: string): Promise<Omit<User, "password">> {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundError("User");
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async forgotPassword(email: string): Promise<void> {
    if (!email) throw { status: 400, message: "Email is required" };

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) throw { status: 404, message: "User not found" };

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    const resetLink = `http://localhost:3000/reset-password/${token}`;
    await sendEmail(
      user.email,
      "Reset Your Password",
      `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`
    );

    await userRepository.save(user);
  }

  static async resetPassword(token: string, newPassword: string): Promise<void> {
    if (!newPassword || newPassword.trim() === "") {
      throw { status: 400, message: "New password is required" };
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw { status: 400, message: "Invalid or expired token" };
    }

    user.password = await encrypt.encryptpass(newPassword);
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await userRepository.save(user);
  }
}
