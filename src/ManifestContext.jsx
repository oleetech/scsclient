import React, { createContext, useState, useContext } from "react";

const ManifestContext = createContext();

export const ManifestProvider = ({ children }) => {
  const [finalManifests, setFinalManifests] = useState([]);

  return (
    <ManifestContext.Provider value={{ finalManifests, setFinalManifests }}>
      {children}
    </ManifestContext.Provider>
  );
};

export const useManifestContext = () => useContext(ManifestContext);
