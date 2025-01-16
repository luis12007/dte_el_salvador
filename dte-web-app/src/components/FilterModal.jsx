import React, { useState } from "react";

const FilterModal = ({ isVisible, filterByc, onClose, onSearch }) => {
  const [name, setName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [type, setType] = useState("");

  const handleSearch = () => {
    if (filterByc === "name") {
      onSearch({ filterByc, value: name });
    } else if (filterByc === "date") {
      onSearch({ filterByc, fromDate, toDate });
    } else if (filterByc === "type") {
      onSearch({ filterByc, value: type });
    }
    onClose();
  };

  if (!isVisible) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content2">
        {filterByc === "name" && (
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className="input-field  w-11/12"
            />
          </div>
        )}
        {filterByc === "date" && (
          <div>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              placeholder="From date"
              className="input-field w-11/12"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              placeholder="To date"
              className="input-field w-11/12"
            />
          </div>
        )}
        {filterByc === "type" && (
          <div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="input-field "
            >
              <option value="">Select type</option>
              <option value="01">Factura</option>
              <option value="03">Credito Fiscal</option>
            </select>
          </div>
        )}
        <div className="flex justify-between">
          <button onClick={handleSearch} className="bg-steelblue-300 text-white py-3 px-3 rounded-lg shadow-md mb-4 text-lg">
            Search
          </button>
          <button onClick={onClose} className="bg-lightcoral text-white py-3 px-4 rounded-lg shadow-md mb-4 text-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
