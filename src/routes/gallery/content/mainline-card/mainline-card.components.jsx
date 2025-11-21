import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../../contexts/user.context";
import { addToFavorites, removeFromFavorites } from "../../../../utils/firebase/firebase.utils";
import "./mainline-card.styles.scss";

const MainlineCard = ({ mainline, userFavorites = [], onFavoriteChange }) => {
  const { name, description, cover, Rating, id } = mainline;
  const { currentUser } = useContext(UserContext);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(userFavorites.includes(id));
  }, [userFavorites, id]);

  const handleStarClick = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking star
    e.stopPropagation();
    
    if (!currentUser) {
      alert("Please sign in to add favorites");
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorites(currentUser.uid, id);
        setIsFavorite(false);
      } else {
        await addToFavorites(currentUser.uid, id);
        setIsFavorite(true);
      }
      
      // Notify parent component to refresh favorites
      if (onFavoriteChange) {
        onFavoriteChange();
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  return (
    <Link to={`/${name}`} className="mainline-card-container">
      <div className="card-header">
        <span 
          className={`star-icon ${isFavorite ? 'favorite' : ''}`} 
          onClick={handleStarClick}
        >
          {isFavorite ? "★" : "☆"}
        </span>
        <span className="name">{name}</span>
      </div>
      <img
        src={process.env.PUBLIC_URL + "/images/kings.pawn/" + cover}
        alt={name}
      />
      <div className="footer">
        <span className="description">{description}</span>
      </div>
      <div className="ratings">
        <span className="rating-bubble">Usage: {Rating.Usage}</span>
        <span className="rating-bubble">Difficulty: {Rating.Difficulty}</span>
      </div>
    </Link>
  );
};

export default MainlineCard;
