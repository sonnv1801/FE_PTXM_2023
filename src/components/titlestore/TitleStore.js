import React from "react";
import "./style.css";
export const TitleStore = (type) => {
  return (
    <div className="title-store">
      <h1>
        Máy PHOTOCOPY <span>{type.type}</span>
      </h1>
    </div>
  );
};
