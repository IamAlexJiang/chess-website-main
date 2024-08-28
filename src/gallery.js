import { useState, useContext, Fragment } from 'react';
import { OpeningsContext } from '../../contexts/categories.context.jsx';
import SortBlock from './sortblock'; 
import { sortMainlines } from './sortblock'; // Correct import
import MainlineCard from './content/mainline-card/mainline-card.components.jsx';
import './gallery.scss';
// change to OpeningMaps
const Gallery = () => {
  const { OpeningsMap } = useContext(OpeningsContext);
  const [sortBy, setSortBy] = useState('name');
  const handleSortChange = (value) => {
    setSortBy(value.toLowerCase());
  };

  return (
    <Fragment>
      <h1 className='gallery-title'>Chess Openings</h1>
      <div className="sort-block-container">
        <SortBlock handleSortChange={handleSortChange} />
      </div>
{/* { Changed to openingsMap not Map. Do three times? 2 below 1 above} */} 
      {Object.keys(OpeningsMap).map(title => {
        const sortedMainlines = sortMainlines(OpeningsMap[title], sortBy);
        return (
          <Fragment key={title}>
            <div className="category-section">
              <h2 className="category-title">{title}</h2>
              <div className='mainlines-container'>
                {sortedMainlines.map((mainline) => (
                  <MainlineCard key={mainline.id} mainline={mainline} />
                ))}
              </div>
            </div>
          </Fragment>
        );
      })}
    </Fragment>
  );
};

export default Gallery;

// Changed the map feature as that is a built in feature to OpeningMap to access the images