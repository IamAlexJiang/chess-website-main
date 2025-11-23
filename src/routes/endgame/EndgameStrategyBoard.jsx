import { useState } from "react";
import "../Board/slider.css";
import { useLocation } from "react-router-dom";
// TODO: Import dummyDataEndgame when data is available
// import dummyDataEndgame from "./dummyData-endgame";

const EndgameStrategyBoard = () => {
  const location = useLocation();

  // Placeholder for future development
  // This will work similarly to StrategyBoard for openings
  // Check if location.state exists and has the name property
  // const matchedData = location.state ? dummyDataEndgame.find((data) => data.name === location.state.name) : null;

  // let steps = [];
  // if (matchedData) {
  //   steps = matchedData.steps;
  // }

  // Placeholder state
  const steps = []; // Will be populated from dummyDataEndgame in future development

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === steps.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? steps.length - 1 : prevIndex - 1
    );
  };

  const resetSlide = () => {
    setCurrentIndex(0);
  };

  return (
    <div className="slider">
      {location.state ? (
        steps.length > 0 ? (
          <>
            <div className="slider-img">
              <img src={steps[currentIndex]} alt={`Slide ${currentIndex + 1}`} />
            </div>
            <div>
              <button onClick={prevSlide}>Previous</button>
              <button onClick={nextSlide}>Next</button>
              <button onClick={resetSlide}>Reset</button>
            </div>
          </>
        ) : (
          <div>
            <p>No steps available yet.</p>
            <p style={{ fontStyle: 'italic', color: '#666' }}>
              Endgame strategy images coming in future development.
            </p>
          </div>
        )
      ) : (
        <div>Please go to endgame gallery to select an endgame strategy</div>
      )}
    </div>
  );
};

export default EndgameStrategyBoard;

