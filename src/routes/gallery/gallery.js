import { useState, Fragment, useEffect } from "react";
import SortBlock from "./sortblock";
import { sortMainlines } from "./sortblock"; // Correct import
import MainlineCard from "./content/mainline-card/mainline-card.components.jsx";
import "./gallery.scss";
import { collection, getDocs } from "firebase/firestore";
import { db, fetchOpenings } from "../../utils/firebase/firebase.utils.js";

const Gallery = () => {
  const [openingMap, setOpeningMap] = useState([]);
  const [sortBy, setSortBy] = useState("name");

  const fetchOpeningsItems = async () => {
    await fetchOpenings(setOpeningMap);
  };

  useEffect(() => {
    fetchOpeningsItems();
  }, []);

  const handleSortChange = (value) => {
    setSortBy(value.toLowerCase());
  };

  console.log(openingMap);

  return (
    <Fragment>
      <h1 className="gallery-title">Chess Openings</h1>
      <div className="sort-block-container">
        <SortBlock handleSortChange={handleSortChange} />
      </div>

      {openingMap?.map(({ title, items }) => {
        const sortedMainlines = sortMainlines(items || [], sortBy);
        return (
          <Fragment key={title}>
            <div className="category-section">
              <h2 className="category-title">{title}</h2>
              <div className="mainlines-container">
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
