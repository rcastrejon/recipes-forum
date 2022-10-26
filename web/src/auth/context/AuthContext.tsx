import { createContext } from "react";
import { User } from "../types/User";

export const AuthContext = createContext('');
export const UserContext = createContext(new User());