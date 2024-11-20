import React from "react";
import formatDate from "../utils/formateDate";
import { Link } from "react-router-dom";

const SearchModal = ({ search, handleSearch, searchResult, clearSearch }) => {
  const clearAndCloseModal = () => {
    clearSearch()
    document.getElementById("searchModal").close();
  }

  return (
    <dialog id="searchModal" className="modal">
      <div className="modal-box font-custom">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-medium text-lg">Search</h3>
        <div className="modal-action">
          <input
            type="text"
            className="input input-bordered input-sm w-full mt-2"
            placeholder="Search..."
            value={search}
            onChange={(e) => handleSearch(e)}
          />
        </div>

        {/* Search result */}
        {searchResult.length > 0 && (
          <div className="mt-4">
            <form method="dialog" className="space-y-4">
              {searchResult.map((result, index) => (
                <Link to={`/${result._id}`} onClick={clearAndCloseModal} key={index}>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-16 h-16 bg-gray-200 rounded-md">
                      <img
                        src={
                          window.location.origin +
                          `/thumbnails/${result.ps_thumbnail}`
                        }
                        alt="Thumbnail"
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <p className="text-sm pb-2">
                        {result.ps_title.length > 45
                          ? result.ps_title.slice(0, 45) + "..."
                          : result.ps_title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(result.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </form>
          </div>
        )}
      </div>
    </dialog>
  );
};

export default SearchModal;
