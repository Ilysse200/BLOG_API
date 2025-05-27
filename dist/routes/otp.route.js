"use strict";
// //Route to request the otp
// import express, { Request, Response, Router } from "express";
// import { sendOTP } from "../controller/Otp.controller";
// const router: Router = express.Router();
// // request new verification OTP
// router.post("/", async (req:Request, res:Response) => {
//   try {
//     const { email, subject, message, duration } = req.body;
//     // Add your OTP logic here
//     const createOTP = await sendOTP({
//         email,
//         subject,
//         message,
//         duration,
//     })
//     res.status(200).json({createOTP});
//   } catch (error) {
//     console.error("Error generating OTP:", error);
//     res.status(500).json({ error: "Internal server error." });
//   }
// });
// export default router;
