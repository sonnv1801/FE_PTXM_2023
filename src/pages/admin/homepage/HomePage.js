import React from "react";
import Menu from "../menu/Menu";

export const HomePageAdmin = () => {
  return (
    <div className="row">
      <div className="col-3">
        <Menu />
      </div>
      <div className="col-9">
        <div className="container-fluid mt-5 text-center">
          <header className="App-header">
            <h1>Admin máy PHOTOCOPY</h1>
          </header>
          <main>
            <h2>Chào mừng đến với cửa hàng máy PHOTOCOPY</h2>
            <p>
              Chúng tôi cung cấp các loại máy PHOTOCOPY chất lượng với giá cả
              phải chăng.
            </p>
          </main>
          <footer>
            <p>Bản quyền © 2023 Shop máy PHOTOCOPY.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};
