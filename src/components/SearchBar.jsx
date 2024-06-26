import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setQuery(searchTerm);
    if (searchTerm.length > 2) {
      fetch(
        `http://127.0.0.1:8000/search?query=${encodeURIComponent(searchTerm)}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setResults(data);
          }
        })
        .catch((err) => console.error("Error fetching search results:", err));
    } else {
      setResults([]);
    }
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 40 && selectedIndex < results.length - 1) {
      // Down arrow
      setSelectedIndex(selectedIndex + 1);
    } else if (event.keyCode === 38 && selectedIndex > 0) {
      // Up arrow
      setSelectedIndex(selectedIndex - 1);
    } else if (event.keyCode === 13 && selectedIndex > -1) {
      // Enter key
      navigate(`/movie/${results[selectedIndex].titleId}`);
      setResults([]); // Clear results to hide the dropdown
      setQuery(""); // Optionally clear the query
    }
  };

  const handleResultClick = (movieId) => {
    console.log("Clicked movie ID:", movieId);
    setResults([]);
    navigate(`/movie/${movieId}`);
    setQuery("");
  };

  const handleBlur = () => {
    // Delay hiding results to allow click event to process
    setTimeout(() => {
      setIsFocused(false);
    }, 300);
  };

  return (
    <div className="searchbar">
      <input
        type="text"
        placeholder="Rechercher un film..."
        value={query}
        onChange={handleSearchChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      {results.length > 0 && isFocused && (
        <ul className="results-dropdown">
          {results.map((movie, index) => (
            <li
              key={movie.titleId}
              onClick={() => handleResultClick(movie.titleId)}
              className={index === selectedIndex ? "selected" : ""}
            >
              {movie.title}
            </li>
          ))}
        </ul>
      )}
      <FontAwesomeIcon icon={faSearch} className="search_icon" />
    </div>
  );
};

export default SearchBar;
