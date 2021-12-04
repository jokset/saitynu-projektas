import { createContext, useContext, useState } from "react";
import client from "../networking";

const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(false);

  console.log("auth initialized")

  const login = async (body) => {
    const response = await client({
        url: 'auth/login',
        method: 'POST',
        data: body,
    });
    document.cookie = `access_token=${response.data.accessToken};max-age=604800`;
  }

  const fetchCurrentUser = async () => {
    try {
      const response = await client({
        url: 'users/me',
        method: 'GET'
      });
      setCurrentUser(response.data);
      return response.data;
    } catch (e) {
      setCurrentUser(null);
      return undefined;
    }
  }

  return (
    <authContext.Provider value={{currentUser, fetchCurrentUser, login}}>
      {children}
    </authContext.Provider>
  );
}

export const useAuth = () => useContext(authContext);

export default authContext;