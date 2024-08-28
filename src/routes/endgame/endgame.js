import { useContext, Fragment } from 'react';
import { EndgameContext } from '../../contexts/endgame.context';
import EndgameCard from './content/endgame-card/endgame-card.components.jsx';
import './endgame.scss';

const Endgame = () => {
  const { endgameMap } = useContext(EndgameContext);

  // Check if endgameMap is undefined or empty
  if (!endgameMap || Object.keys(endgameMap).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      {Object.keys(endgameMap).map((title) => (
        <Fragment key={title}>
          <h2 className="category-title">{title}</h2>
          <div className='endgames-container'>
            {endgameMap[title].map((endgame) => (
              <EndgameCard key={endgame.id} endgame={endgame} />
            ))}
          </div>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default Endgame;
