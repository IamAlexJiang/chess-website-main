import { useState, Fragment, useEffect, useContext } from "react";
import SortBlock from "./sortblock";
import { sortMainlines } from "./sortblock"; // Correct import
import MainlineCard from "./content/mainline-card/mainline-card.components.jsx";
import "./gallery.scss";
import { fetchOpenings, getUserFavorites } from "../../utils/firebase/firebase.utils.js";
import { UserContext } from "../../contexts/user.context";

const Gallery = () => {
  const [openingMap, setOpeningMap] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [userFavorites, setUserFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { currentUser } = useContext(UserContext);

  const fetchOpeningsItems = async () => {
    await fetchOpenings(setOpeningMap);
  };

  const fetchUserFavorites = async () => {
    if (currentUser) {
      const favorites = await getUserFavorites(currentUser.uid);
      setUserFavorites(favorites);
    } else {
      setUserFavorites([]);
    }
  };

  useEffect(() => {
    fetchOpeningsItems();
  }, []);

  useEffect(() => {
    fetchUserFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleSortChange = (value) => {
    setSortBy(value.toLowerCase());
  };

  const handleShowFavoritesToggle = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
  };

  return (
    <Fragment>
      <h1 className="gallery-title">Chess Openings</h1>
      <div className="sort-block-container">
        <SortBlock 
          handleSortChange={handleSortChange} 
          showFavoritesOnly={showFavoritesOnly}
          onShowFavoritesToggle={handleShowFavoritesToggle}
          currentUser={currentUser}
        />
      </div>

      {openingMap?.map(({ title, items }) => {
        let filteredItems = items || [];
        
        // Filter to show only favorites if toggle is on
        if (showFavoritesOnly && currentUser) {
          filteredItems = filteredItems.filter(item => userFavorites.includes(item.id));
        }
        
        const sortedMainlines = sortMainlines(filteredItems, sortBy, userFavorites);
        
        // Don't show category if no items after filtering
        if (sortedMainlines.length === 0) return null;
        
        return (
          <Fragment key={title}>
            <div className="category-section">
              <h2 className="category-title">{title}</h2>
              <div className="mainlines-container">
                {sortedMainlines.map((mainline) => (
                  <MainlineCard 
                    key={mainline.id} 
                    mainline={mainline} 
                    userFavorites={userFavorites}
                    onFavoriteChange={fetchUserFavorites}
                  />
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
