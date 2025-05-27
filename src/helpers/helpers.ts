import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { payload } from "../dto/user.dto";

dotenv.config();
const { JWT_SECRET = "" } = process.env;
export class encrypt {
  static async encryptpass(password: string): Promise<string> {
  if (!password) throw new Error("Password is required for hashing");
  return await bcrypt.hash(password, 12); // use async hash
}
static async comparepassword(password: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(password, hashed);
}

  static generateToken(payload: payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
  }

  static async hashData(data: string, saltRounds = 10): Promise<string> {
    return bcrypt.hash(data, saltRounds);
  }

  static async verifyHashedData(unhashed: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(unhashed, hashed);
  }
}