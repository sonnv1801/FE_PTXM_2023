import React from "react";
import "./style.css";
export const CartMini = (name) => {
  return (
    <div className="cart-mini">
      <div className="body-cart">
        <a href="#">{name.name}</a>
      </div>
    </div>
  );
};
