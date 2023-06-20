import React from "react";
import "./style.css";
export const CartMini = (name) => {
  console.log(name, "listTypePhuTungmmm");
  return (
    <div className="cart-mini">
      <div className="body-cart">
        <a href="#">{name.name}</a>
      </div>
    </div>
  );
};
