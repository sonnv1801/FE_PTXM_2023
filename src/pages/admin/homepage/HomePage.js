import React from "react";
import Menu from "../menu/Menu";

export const HomePageAdmin = () => {
  return (
    <div className="row">
      <div className="col-3 menu-admin-dt">
        <Menu />
      </div>
      <div className="col-xl-9 col-sm-12">
        <div className="container-fluid mt-5 text-center">
          <header className="App-header">
            <h1>Admin Phụ Tùng Xe Máy</h1>
          </header>
          <main>
            <h2>Chào mừng đến với cửa hàng phụ tùng xe máy</h2>
            <p>
              Chúng tôi cung cấp các loại phụ tùng xe máy chất lượng với giá cả
              phải chăng.
            </p>
          </main>
          <footer>
            <p>Bản quyền © 2023 Shop Phụ Tùng Xe Máy.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};
