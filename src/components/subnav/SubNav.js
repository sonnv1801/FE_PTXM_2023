import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

const SubNav = () => {
  return (
    <div className="nav-title-header">
      <div className="sub-nav-body">
        <span>
          <img src="https://clickbuy.com.vn/clipse.svg" alt="clipse" />
        </span>
        <p>
          <Link to="/">
            Chào mừng bạn đến với Cửa hàng kinh doanh phụ Tùng xe máy Honda Quốc
            Nguyên
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SubNav;
