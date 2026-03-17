// contexts/UserContextProvider.tsx para React Native
import React, { createContext, type JSX } from "react";
import useIsLoginContext from "../hooks/useIsLoginContext";

interface IUserContextProviderProps {
  children: JSX.Element[] | JSX.Element;
}

// Exportamos el tipo para usarlo en otros lugares
export type UserContextType = ReturnType<typeof useIsLoginContext>;

export const UserContext = createContext<UserContextType>(
  {} as UserContextType
);

const UserContextProvider = ({ children }: IUserContextProviderProps) => {
  const contextValue = useIsLoginContext();

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;