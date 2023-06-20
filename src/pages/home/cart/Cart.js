import React from "react";
import { useSelector } from "react-redux";
import { CardHorizontal } from "../../../components/cardhorizontal/CardHorizontal";
import CustomizedBreadcrumbs from "../../../components/customizedBreadcrumbs/CustomizedBreadcrumbs";
import { Payment } from "../payment/Payment";
import "./style.css";
export const Cart = () => {
  const cart = useSelector((state) => state.defaultReducer.cart);
  return (
    <div className="cart-container container">
      <div className="breadcrumbs-prd">
        <CustomizedBreadcrumbs name={"Giỏ hàng"} />
      </div>
      <div className="body-cart">
        <div className="sub-body-cart">
          <CardHorizontal cart={cart} />
          {/* <div className="row">
            <div className="col-6">
              <p className="carts">Giỏ hàng</p>
            </div>
            <div className="col-6">
              <Payment />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};
