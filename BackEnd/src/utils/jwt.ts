import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export function signJwt(payload: object, options?: jwt.SignOptions): string {
  return jwt.sign(payload, JWT_SECRET, options || { expiresIn: "1h" });
}

export function verifyJwt(token: string): jwt.JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  } catch (error) {
    return null;
  }
}
