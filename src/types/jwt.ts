export interface CustomJwtPayload {
  id: string;
  email: string;
  role: "user" | "admin";
}
