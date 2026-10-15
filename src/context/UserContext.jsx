import { createContext, useContext, useState } from "react";

const UserContext = createContext();  //creates a context for sharing information.
//created the place where the information

export function UserProvider({ children }) { // makes the shared data available to its child components.
  const [user, setUser] = useState({ // stores the user's details.
    name: "Rahul",
    role: "admin",
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>  {/* shares both the user data and the function to update it.*/}
      {children} {/* represents the components wrapped inside the provider.*/}
    </UserContext.Provider>
  );
  // Provider makes the shared information available.
  // value contains the information and the update function.
  // children means the screens placed inside the provider. 
}

export function useUser() { // is a custom Hook that makes the context easier to access. (ShortCut)
  return useContext(UserContext);
}