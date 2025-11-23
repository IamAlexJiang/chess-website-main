import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchEndgame } from "../../utils/firebase/firebase.utils";
// import { Link } from "react-router-dom"; // Future development - will enable navigation to EndgameStrategyBoard
import "../Bio/bio.css";

const EndgameBio = () => {
  const { name } = useParams();
  const [endgameMap, setEndgameMap] = useState([]);

  const fetchEndgameItems = async () => {
    await fetchEndgame(setEndgameMap);
  };

  useEffect(() => {
    fetchEndgameItems();
  }, []);

  // Find the relevant item based on the name
  const category = endgameMap?.find((category) =>
    category.items.some((item) => item.name === name)
  );
  const findedEndgame = category
    ? category?.items?.find((item) => item.name === name)
    : null;

  if (!findedEndgame) {
    return <div>Loading...</div>;
  }

  const { description, cover } = findedEndgame;

  return (
    <div className="card-details-container">
      <p className="heading">{name}</p>
      <div className="image-description-section">
        <div className="description-section">
          <p>{description}</p>
          {/* Future Development: Link to endgame strategy viewer */}
          {/* <Link to={`/endgame-strategy`} state={{ name: name }}>
            <button>Start</button>
          </Link> */}
          {/* Placeholder button - functionality coming in future development */}
          <button disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            Start (Coming Soon)
          </button>
        </div>
        <div className="image-section">
          <img src={process.env.PUBLIC_URL + "/images/endgame/" + cover} alt={name} />
          <p>{name}</p>
        </div>
      </div>
    </div>
  );
};

export default EndgameBio;

