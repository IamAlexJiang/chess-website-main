import React from "react";

export const sortMainlines = (mainlines, sortBy, userFavorites = []) => {
  return [...mainlines].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "usage":
        return b.Rating.Usage - a.Rating.Usage;
      case "difficulty":
        return a.Rating.Difficulty - b.Rating.Difficulty;
      case "favorites":
        const aIsFavorite = userFavorites.includes(a.id);
        const bIsFavorite = userFavorites.includes(b.id);
        if (aIsFavorite && !bIsFavorite) return -1;
        if (!aIsFavorite && bIsFavorite) return 1;
        return a.name.localeCompare(b.name); // Secondary sort by name
      default:
        return 0;
    }
  });
};

const SortBlock = ({ handleSortChange, showFavoritesOnly, onShowFavoritesToggle, currentUser }) => {
  return (
    <div id="sort-container">
      <div className="sort-controls">
        <label id="sort-label" htmlFor="sort">
          Sort by:
        </label>
        <select id="sort" onChange={(e) => handleSortChange(e.target.value)}>
          <option value="name">Name</option>
          <option value="usage">Usage</option>
          <option value="difficulty">Difficulty</option>
          <option value="favorites">Favorites</option>
        </select>
      </div>
      
      {currentUser && (
        <div className="favorites-controls">
          <label className="favorites-toggle">
            <input
              type="checkbox"
              checked={showFavoritesOnly}
              onChange={onShowFavoritesToggle}
            />
            <span className="toggle-text">Show Favorites Only</span>
          </label>
        </div>
      )}
    </div>
  );
};

export default SortBlock;
