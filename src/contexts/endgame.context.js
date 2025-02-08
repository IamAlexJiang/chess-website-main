import { createContext, useState, useEffect } from "react";
import {
  getEndgamesAndDocuments,
  addCollectionAndDocuments,
} from "../utils/firebase/firebase.utils";
import { ENDGAMES } from "../routes/endgame/content/endgame-card/data.endgame"; // Correct import

export const EndgameContext = createContext({
  endgameMap: {},
});

export const EndgameProvider = ({ children }) => {
  const [endgameMap, setEndgamesMap] = useState({});

  useEffect(() => {
    const getEndgamesMap = async () => {
      const endgameMap = await getEndgamesAndDocuments();
      setEndgamesMap(endgameMap);
    };

    getEndgamesMap();
  }, []);
  //     useEffect(() => {
  //       addCollectionAndDocuments('endgames', ENDGAMES)
  // }, []);

  const value = { endgameMap };
  return (
    <EndgameContext.Provider value={value}>{children}</EndgameContext.Provider>
  );
};
