// AppContext.js
import React, { createContext, useContext, useState } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentUserUid, setCurrentUserUid] = useState(null);
  const [selectedUserUid, setSelectedUserUid] = useState(null);
  const [currentUserName, setCurrentUserName] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);

  return (
    <AppContext.Provider
      value={{ currentUserUid, setCurrentUserUid, selectedUserUid, setSelectedUserUid,currentUserName, setCurrentUserName ,selectedUserName, setSelectedUserName}}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
