import React, { useState } from "react";
import ProfileInfo from "../Cards/ProfileInfo/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";

export default function Navbar({userInfo,onSearchNote,handleClearSearch}) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if(searchQuery){
      onSearchNote(searchQuery)
    }
  };
  
  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  return (
    <div className="px-6 py-2 bg-white drop-shadow flex items-center justify-between">
      <h2 className="text-xl font-medium text-black py-2">Notes</h2>
      <SearchBar
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />
      {
        userInfo &&
      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
      }
    </div>
  );
}
