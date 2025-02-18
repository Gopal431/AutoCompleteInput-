"use client";
import { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import debounce from "lodash.debounce";
import jsonData from "../src/data.json";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const debouncedFilter = debounce((term) => {
      if (!term) {
        setFilteredData([]);
        return;
      }
      const results = jsonData.filter((item) =>
        item.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredData(results);
    }, 300);

    debouncedFilter(searchTerm);
    return () => debouncedFilter.cancel();
  }, [searchTerm]);

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <strong key={index} className="text-blue-600">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredData([]);
  };

  return (
    <div className="w-96 mx-auto mt-10 p-4 border border-gray-300 rounded-lg shadow-lg bg-white">
      <div className="flex items-center border-b pb-2 rounded-full bg-gray-100 px-3">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          className="w-full p-2 outline-none bg-transparent rounded-full"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <FaTimes
            className="text-gray-400 ml-2 cursor-pointer"
            onClick={clearSearch}
          />
        )}
      </div>
      {filteredData.length > 0 && (
        <ul className="mt-2 ">
          {filteredData.map((item) => (
            <li key={item.id} className="p-2 hover:bg-gray-100 cursor-pointer flex items-center">
              <FaSearch className="text-gray-400 mr-2" />
              {highlightMatch(item.name, searchTerm)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
