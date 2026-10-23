/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { clearSession, getStoredUser } from "../../services/sessionStore";

const UserContext = createContext(null);
export function UserProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  function logout() { clearSession(); setUser(null); }
  return <UserContext.Provider value={{ user, setUser, logout }}>{children}</UserContext.Provider>;
}
export function useUser() { return useContext(UserContext); }
