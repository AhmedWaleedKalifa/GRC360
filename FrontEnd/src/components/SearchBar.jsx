// components/SearchBar.jsx
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

function SearchBar({ active, onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="searchBar">
      <label htmlFor="search">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon" />
      </label>
      <input
        type="text"
        id="search"
        name="search"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={" Search " + active}
        className="searchInput"
      />
    </form>
  );
}

export default SearchBar;