import mongoose, { Document, Schema } from "mongoose";

// Define the TypeScript interface for the OTP document
export interface IOTP extends Document {
  email: string;
  otp: string;
  createdAt: Date;
  expiresAt: Date;
}

// Define the schema
const OTPSchema: Schema<IOTP> = new Schema<IOTP>({
  email: { type: String, unique: true, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
});

// Create the model
const OTP = mongoose.model<IOTP>("OTP", OTPSchema);

// Export the model
export default OTP;
