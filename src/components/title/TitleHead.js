import React from "react";
import { Link } from "react-router-dom";
import "./style.css";
function TitleHead(type, link) {
  console.log(link, "link");
  return (
    <div className="container-content sm-container-content">
      <h1>Sản Phẩm COMBO XE MÁY</h1>
      <div className="sub-content sm-sub-content">
        <ul>
          {type.type.map((item, index) => (
            <Link to={`/shopcombo/${item.link}`} key={index}>
              <li>{item.name}</li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TitleHead;
