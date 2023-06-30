import React from "react";
import "./style.css";
export const TitleStore = (type) => {
  return (
    <div className="title-store">
      <h1>
        Phụ tùng <span>{type.type}</span>
      </h1>
    </div>
  );
};
