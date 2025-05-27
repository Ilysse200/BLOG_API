// import sendEmail from '../utils/sendEmail';
// import generateOTP from '../utils/generateOTP';
// import dotenv from 'dotenv';
// import OTP from '../otp/model';
// import { encrypt } from '../helpers/helpers';

// dotenv.config();

// interface SendOTPArgs {
//   email: string;
//   subject: string;
//   message: string;
//   duration?: number;
// }

// const { AUTH_EMAIL } = process.env;

// export const sendOTP = async ({ email, subject, message, duration = 1 }: SendOTPArgs) => {
//   try {
//     if (!email || !subject || !message) {
//       throw new Error('Please provide email, subject, and message.');
//     }

//     const generatedOTP = await generateOTP();

//     const mailOptions = {
//       from: AUTH_EMAIL!,
//       to: email,
//       subject,
//       html: `
//         <p>${message}</p>
//         <p style="color:tomato; font-size:25px; letter-spacing:2px;">
//           <b>${generatedOTP}</b>
//         </p>
//         <p>This code <b>expires in ${duration} hour(s)</b>.</p>
//       `,
//     };

//     await sendEmail(mailOptions);

//     const hashedOTP = await encrypt.hashData(generatedOTP);

//     const newOTP = await OTP.create({
//       email,
//       otp: hashedOTP,
//       createdAt: new Date(),
//       expiresAt: new Date(Date.now() + duration * 60 * 60 * 1000),
//     });

//     return {
//       message: 'OTP sent and saved successfully!',
//       data: newOTP,
//     };
//   } catch (error) {
//     console.error("Error in sendOTP:", error);
//     throw error;
//   }
// };
