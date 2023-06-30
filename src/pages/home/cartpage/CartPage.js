import axios from "axios";
import React, { useEffect, useState } from "react";
import "./style.css";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Button } from "@mui/material";

export const CartPage = () => {
  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    // Get the cart data from localStorage
    const existingCartData = localStorage.getItem("cart");
    if (existingCartData) {
      const cart = JSON.parse(existingCartData);
      setCartData(cart.products);
    }
  }, []);

  const handleDeleteOrder = (index) => {
    // Create a copy of the current cart data
    const updatedCartData = [...cartData];
    // Remove the order at the specified index
    updatedCartData.splice(index, 1);
    // Update the state and localStorage
    setCartData(updatedCartData);
    updateLocalStorage(updatedCartData);
  };

  const updateLocalStorage = (cartData) => {
    // Get the existing cart data from localStorage
    const existingCart = localStorage.getItem("cart");

    if (existingCart) {
      // If the cart data exists, parse it and update the products array
      const updatedCart = JSON.parse(existingCart);
      updatedCart.products = cartData;

      // Store the updated cart data in localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const handlePurchase = async () => {
    if (cartData.length === 0) {
      toast.error("Your cart is empty.", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    const user = JSON.parse(localStorage.getItem("token"));

    try {
      const customerId = user._id; // Thay đổi customerId tùy theo nhu cầu của bạn

      // Chuyển đổi dữ liệu giỏ hàng thành dạng products
      const products = cartData.map((product) => ({
        productCode: product.productCode,
        quantity: product.quantity,
      }));

      const response = await axios.post("http://localhost:8000/v1/order", {
        customerId,
        products,
      });

      // Xử lý phản hồi từ API sau khi đặt hàng thành công
      console.log(response.data);
      localStorage.removeItem("cart");
      setCartData([]);
      toast.success("Đơn Hàng Đã Nhận", {
        position: toast.POSITION.TOP_CENTER,
      });
      navigate("/orderpage");
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error(error);
    }
  };
  const orderCount = cartData.length;

  return (
    <div className="cart-page">
      <h1>
        Đơn Hàng Của Bạn
        <Link to="/admin">
          <Button
            variant="outlined"
            endIcon={<ArrowRightIcon />}
            // onClick={handlePurchase}
            style={{ margin: "0", marginLeft: "1rem" }}
          >
            Tiếp tục mua hàng
          </Button>
        </Link>
      </h1>
      {cartData.length === 0 ? (
        <p>Chưa có đơn nào</p>
      ) : (
        <div>
          <p>Tổng đơn hàng: {orderCount}</p>
          <ul className="cart-list">
            {cartData.map((product, index) => (
              <li key={index} className="cart-item">
                <p className="product-code">
                  Mã Sản Phẩm: {product.productCode}
                </p>
                <p className="quantity">Quantity: {product.quantity}</p>
                <button onClick={() => handleDeleteOrder(index)}>Xóa</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {user === null ? (
        <Link to="/login">
          <Button variant="contained" endIcon={<ArrowRightIcon />}>
            Đăng nhập ngay?
          </Button>
        </Link>
      ) : (
        <>
          {cartData.length === 0 ? null : (
            <button onClick={handlePurchase}>Đặt Đơn</button>
          )}
        </>
      )}
    </div>
  );
};
