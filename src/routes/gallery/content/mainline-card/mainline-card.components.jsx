import { Link } from "react-router-dom";
import "./mainline-card.styles.scss";

const MainlineCard = ({ mainline }) => {
  const { name, description, cover, Rating } = mainline;

  return (
    <Link to={`/${name}`} className="mainline-card-container">
      <span className="name">{name}</span>
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
