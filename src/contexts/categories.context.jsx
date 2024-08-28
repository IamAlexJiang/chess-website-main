import { createContext, useState, useEffect } from "react";
import { MAINLINES } from "../routes/gallery/content/data.mainlines";

import {
  getCategoriesAndDocuments,
  addCollectionAndDocuments,
} from "../utils/firebase/firebase.utils";

export const OpeningsContext = createContext({
  OpeningsMap: {},
});

export const OpeningsProvider = ({ children }) => {
  const [OpeningsMap, setOpeningsMap] = useState({});

  useEffect(() => {
    const getCategoriesMap = async () => {
      const categoryMap = await getCategoriesAndDocuments();
      setOpeningsMap(categoryMap);
    };

    getCategoriesMap();
  }, []);
    // useEffect(() => {
    //   addCollectionAndDocuments("openings", MAINLINES);
    // }, []);
  const value = { OpeningsMap };
  return (
    <OpeningsContext.Provider value={value}>
      {children}
    </OpeningsContext.Provider>
  );
};

//check
