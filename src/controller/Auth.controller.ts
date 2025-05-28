import { Request, Response } from "express";
import { AuthService } from "../service/Auth.service";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const token = await AuthService.register(req.body);
      return res.status(201).json({ message: "User created", token });
    } catch (err: any) {
      return res.status(err.status || 500).json({ message: err.message || "Server error" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { token } = await AuthService.login(req.body);
      return res.status(200).json({ message: "Login successful", token });
    } catch (err: any) {
      return res.status(err.status || 500).json({ message: err.message || "Server error" });
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const currentUser = (req as any).currentUser;
      if (!currentUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await AuthService.getProfile(currentUser.id);
      return res.status(200).json(user);
    } catch (err: any) {
      return res.status(err.status || 500).json({ message: err.message || "Server error" });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      await AuthService.forgotPassword(req.body.email);
      return res.status(200).json({ message: "Reset link sent to email." });
    } catch (err: any) {
      return res.status(err.status || 500).json({ message: err.message || "Server error" });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      await AuthService.resetPassword(token, newPassword);
      return res.status(200).json({ message: "Password reset successfully." });
    } catch (err: any) {
      return res.status(err.status || 500).json({ message: err.message || "Server error" });
    }
  }
}
