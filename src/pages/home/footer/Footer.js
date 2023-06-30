import React from "react";
import "./style.css";

import { Link } from "react-router-dom";
import FooterPolicy from "./FooterPolicy";
import FooterSupport from "./FooterSupport";
import FooterLocation from "./FooterLocation";
import FooterSocial from "./FooterSocial";
const Footer = () => {
  return (
    <footer className="bg-light sm-bg-light" >
      <div className="container">
        <div className="row">
          <FooterPolicy />
          <FooterSupport />
          <FooterLocation />
          <FooterSocial />
        </div>
      </div>
      <div className="text-center p-3 copy-right sm-copy-right">
        © 2023 Bản Quyền:
        <Link className="text-dark" href="https://mdbootstrap.com/">
          Cửa hàng kinh doanh phụ Tùng xe máy Honda Quốc Nguyên
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
