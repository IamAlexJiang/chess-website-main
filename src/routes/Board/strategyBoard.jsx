import { useState } from "react";
import "./board.css";
import { useLocation } from "react-router-dom";
import dummyData from "./dummyData";

const StrategyBoard = () => {
 
const location = useLocation();

// Check if location.state exists and has the name property
const matchedData = location.state ? dummyData.find((data) => data.name === location.state.name) : null;

let steps = [];

if (matchedData) {
    steps  = matchedData.steps;   
}


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
}




return (
    location.state ? (
        <div className="slider">
            {steps.length > 0 ? (
                <>
                    <img src={steps[currentIndex]} alt={`Slide ${currentIndex + 1}`} />
                    <div>
                        <button onClick={prevSlide}>Previous</button>
                        <button onClick={nextSlide}>Next</button>
                        <button onClick={resetSlide}>Reset</button>
                    </div>
                </>
            ) : (
                <div>No steps available</div>
            )}
        </div>
    ) : (
        <div>Please go to gallary to select a strategy</div>
    )
    
);

};

export default StrategyBoard;
