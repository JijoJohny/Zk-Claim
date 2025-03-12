"use client";

import { createContext, useContext, useEffect, useState } from "react";

const DIDContext = createContext(null);

export function DIDProvider({ children }) {
  const [did, setDid] = useState("");

  useEffect(() => {
    const storedDid = localStorage.getItem("did");
    if (storedDid) setDid(storedDid);
  }, []);

  return (
    <DIDContext.Provider value={{ did, setDid }}>
      {children}
    </DIDContext.Provider>
  );
}

export function useDID() {
  return useContext(DIDContext);
}
