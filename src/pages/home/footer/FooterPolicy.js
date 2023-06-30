import React from "react";
import { Link } from "react-router-dom";

const FooterPolicy = () => {
  return (
    <div className="col-lg-3 col-md-6 mb-4 mb-md-0 privacy-policy">
      <h5 className=" text-center">Chính Sách</h5>
      <ul className="list-unstyled mb-0 ">
        <li>
          <Link to="/" className="text-dark">
            Máy PHOTOCOPY
          </Link>
        </li>
        <li>
          <Link to="/" className="text-dark">
            Máy PHOTOCOPY combo
          </Link>
        </li>
        <li>
          <Link to="/" className="text-dark">
            Chính Sách Mua Hàng
          </Link>
        </li>
        <li>
          <Link to="/" className="text-dark">
            Chính sách mua hàng Online
          </Link>
        </li>
        <li>
          <Link to="/" className="text-dark">
            Mua hàng trả góp
          </Link>
        </li>
        <li>
          <Link to="/" className="text-dark">
            Chính sách bảo mật thông tin khách hàng
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default FooterPolicy;
