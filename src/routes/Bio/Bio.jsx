import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchOpenings } from "../../utils/firebase/firebase.utils";
import { Link } from "react-router-dom";
import "./bio.css";

const Bio = () => {
  const { name } = useParams();
  const [openingMap, setOpeningMap] = useState([]);

  const fetchOpeningsItems = async () => {
    await fetchOpenings(setOpeningMap);
  };

  useEffect(() => {
    fetchOpeningsItems();
  }, []);

  // Find the relevant item based on the name
  const category = openingMap?.find((category) =>
    category.items.some((item) => item.name === name)
  );
  const findedMainline = category
    ? category?.items?.find((item) => item.name === name)
    : null;

  if (!findedMainline) {
    return <div>Loading...</div>;
  }

  const { description, cover, steps } = findedMainline;

  return (
    <div className="card-details-container">
      <p className="heading">{name}</p>
      <div className="image-description-section">
        <div className="description-section">
          <p>{description}</p>
          <Link to={`/strategy`} state={{
            name:name,
            // steps:[
            //   'https://i.pinimg.com/736x/14/5a/d8/145ad8a8af3318681a705f281a44c3a3.jpg',
            //   'https://drive.google.com/file/d/1jHQ7pjq0NMo9bJ918k8rj8dS7CA4ChI4/view?usp=sharing',
            //   'https://via.placeholder.com/500x300/900C3F',
            //   'https://via.placeholder.com/500x300/581845'
            // ]
            }}><button>Start</button></Link>
        </div>
        <div className="image-section">
          <img src={"/images/kings.pawn/" + cover} />
          <p>{name}</p>
        </div>
      </div>
    </div>
  );
};

export default Bio;
