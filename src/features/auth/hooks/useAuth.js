import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be executed within an explicit AuthProvider wrapper node tree.");
  }
  return context;
}
