import React from "react";
import { Link } from "react-router-dom";
import "./style.css";
function TitlePT(type, link) {
  console.log(link, "link");
  return (
    <div className="container-content sm-container-content">
      <h1>Sản Phẩm PHỤ TÙNG XE MÁY</h1>
      <div className="sub-content sm-sub-content">
        <ul>
          {type.type.map((item, index) => (
            <Link to={`/shop/${item.name}`} key={index}>
              <li>{item.name}</li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TitlePT;
