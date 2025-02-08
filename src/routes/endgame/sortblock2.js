import React from "react";

export const sortEndgames = (endgames, sortBy) => {
  return [...endgames].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "usage":
        return b.Rating.Usage - a.Rating.Usage;
      case "difficulty":
        return a.Rating.Difficulty - b.Rating.Difficulty;
      default:
        return 0;
    }
  });
};

const SortBlock2 = ({ handleSortChange }) => {
  return (
    <div id="sort-container">
      <label id="sort-label" htmlFor="sort">
        Sort by:
      </label>
      <select id="sort" onChange={(e) => handleSortChange(e.target.value)}>
        <option value="name">Name</option>
        <option value="usage">Usage</option>
        <option value="difficulty">Difficulty</option>
      </select>
    </div>
  );
};

export default SortBlock2;
