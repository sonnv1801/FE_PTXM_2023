import React from "react";
import "./style.css";

export const Pagination = ({
  currentPage,
  goToPreviousPage,
  goToNextPage,
  hasNextPage,
}) => {
  return (
    <div className="pagination">
      <button
        className="pagination-page"
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
      >
        Trước
      </button>
      <span className="text-page">Trang {currentPage}</span>
      {hasNextPage && (
        <button className="pagination-page" onClick={goToNextPage}>
          Sau
        </button>
      )}
    </div>
  );
};
