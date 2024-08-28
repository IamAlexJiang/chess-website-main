// src/routes/endgame/content/endgame-card/endgame-card.components.jsx
import './endgame-card.styles.scss';

const EndgameCard = ({ endgame }) => {
  const { name, description, cover } = endgame;

  return (
    <div className='endgame-card-container'>
      <span className='name'>{name}</span>
      <img
        src={process.env.PUBLIC_URL + '/images/endgame/' + cover}
        alt={name}
      />
      <div className='footer'>
        <span className='description'>{description}</span>
      </div>
    </div>
  );
};

export default EndgameCard;
