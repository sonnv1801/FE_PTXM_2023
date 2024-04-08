import React from "react";
import { Link } from "react-router-dom";

const FooterSupport = () => {
  return (
    <div className="col-lg-3 col-md-6 mb-4 mb-md-0 support-sw">
      <h5 className=" text-center">Hỗ trợ</h5>
      <ul className="list-unstyled text-center">
        <li className="text-center">
          <Link to="/" className="text-dark">
            <b>Cửa hàng kinh doanh phụ Tùng xe máy Honda Văn Sơn</b>
            <br />
            <span style={{ fontSize: "16px" }}>(Từ 8:00-21:00)</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default FooterSupport;
