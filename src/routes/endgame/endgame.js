import { useContext, Fragment, useState, useEffect } from 'react';

import Sortblock2 from './sortblock2.js';
import { sortEndgames } from './sortblock2';

import { EndgameContext } from '../../contexts/endgame.context';
import EndgameCard from './content/endgame-card/endgame-card.components.jsx';
import './endgame.scss';

import { collection, getDocs } from "firebase/firestore";
import { db, fetchEndgame } from '../../utils/firebase/firebase.utils'

const Endgame = () => {
  const [endgameMap, setEndgameMap] = useState([]);
  const [sortBy, setSortBy] = useState("name");

  const fetchEndgameItems = async () => {
    await fetchEndgame(setEndgameMap);
  };

  useEffect(() => {
    fetchEndgameItems();
  }, []);

  const handleSortChange = (value) => {
    setSortBy(value.toLowerCase());
  };

  console.log(endgameMap);


  return (
    <Fragment>
     <h1 className="endgame-title">Chess Endgames</h1>
     <div className="sort-block-container">
      <Sortblock2 handleSortChange={handleSortChange} />
     </div>
    
    {endgameMap?.map(({ title, items }) => {
      const sortedEndgames = sortEndgames(items || [], sortBy);
      return (
        <Fragment key={title}>
          <div className="category-section">
            <h2 className="category-title">{title}</h2>
            <div className="endgames-container">
              {sortedEndgames.map((endgame) => (
                <EndgameCard key={endgame.id} endgame={endgame} />
              ))}
            </div>
          </div>
        </Fragment>
      );
    })}
    </Fragment>
  );
};

export default Endgame





// import { useContext, Fragment } from 'react';
// import { EndgameContext } from '../../contexts/endgame.context';
// import EndgameCard from './content/endgame-card/endgame-card.components.jsx';
// import './endgame.scss';

// const Endgame = () => {
//   const { endgameMap } = useContext(EndgameContext);

//   // Check if endgameMap is undefined or empty
//   if (!endgameMap || Object.keys(endgameMap).length === 0) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <Fragment>
//      <h1 className="endgame-title">Chess Openings</h1>
//       {Object.keys(endgameMap).map((title) => (
//         <Fragment key={title}>
//           <h2 className="category-title">{title}</h2>
//           <div className='endgames-container'>
//             {endgameMap[title].map((endgame) => (
//               <EndgameCard key={endgame.id} endgame={endgame} />
//             ))}
//           </div>
//         </Fragment>
//       ))}
//     </Fragment>
//   );
// };

// export default Endgame;

