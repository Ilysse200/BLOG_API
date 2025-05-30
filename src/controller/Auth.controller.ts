import { NextFunction, Request, Response } from "express";
import { AuthService } from "../service/Auth.service";
import { asyncHandler } from "../middleware/errorHandler";
import { ApiResponse, AuthenticatedRequest } from "../types/common.types";
import { CreateUserInput, UpdateUserInput} from "../schema/user.schema";


export class AuthController {
  // static async register(req: Request, res: Response) {
  //   try {
  //     const token = await AuthService.register(req.body);
  //     return res.status(201).json({ message: "User created", token });
  //   } catch (err: any) {
  //     return res.status(err.status || 500).json({ message: err.message || "Server error" });
  //   }
  // }




  // static async login(req: Request, res: Response) {
  //   try {
  //     const { token } = await AuthService.login(req.body);
  //     return res.status(200).json({ message: "Login successful", token });
  //   } catch (err: any) {
  //     return res.status(err.status || 500).json({ message: err.message || "Server error" });
  //   }
  // }

  static async getProfile(req: Request, res: Response<ApiResponse>) {
    try {
      const currentUser = (req as any).user;
      if (!currentUser) {
        return res.status(401).json({
          success:false,
          message:"Profile not loaded successfully!!",
        });
      }

      const user = await AuthService.getProfile(currentUser.id);
      return res.status(200).json({
        success:true,
        message:"Profile loaded successfully!!",
        data:{
          name:user.name,
          email:user.email,
          role:user.role
        }
      });
    } catch (err: any) {
      return res.status(err.status || 500).json({
        success:false,
        message:"Error loading Profile!!"
      });
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

export const register = asyncHandler(async(

  req: AuthenticatedRequest & CreateUserInput,
  res: Response<ApiResponse>,
  next: NextFunction
)=>{
   const user = await AuthService.register(req.body)
   res.status(201).json({
    success:true,
    message:"User registered successfully!!!",
    data:{
      user:{
        id: user.id,
        name: user.name,
        email:user.email,
        role:user.role
      }
    }
   })
})

export const login = asyncHandler(async(

  req:AuthenticatedRequest  & CreateUserInput,
  res: Response<ApiResponse>
)=>{
  const user = await AuthService.login(req.body)
  res.status(200).json({
    success:true,
    message:'User found in the database',
    data:{
      user:{
        id:user.id,
        name:user.name,
        email:user.email,
        role:user.role,
        token:user.resetToken,
      }
    }
  }) 
})

//Function to delete the user

export const deleteUser = asyncHandler(async(
  req:UpdateUserInput,
  res:Response<ApiResponse>,
  next: NextFunction
)=>{
    const{id} = req.params;
    const deleteUser = await AuthService.deleteUser(id);
    res.status(200).json({
      success:true,
      message:"User deleted successfully!!"
    })
})
