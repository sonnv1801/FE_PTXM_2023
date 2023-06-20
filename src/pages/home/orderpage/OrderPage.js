import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";
import "react-toastify/dist/ReactToastify.css";
import numeral from "numeral";
import moment from "moment";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("token"));
      const customerId = user?._id;
      const response = await axios.get(
        `https://phutungxemay.onrender.com/v1/order/${customerId}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchOrderHistories = async (orderId) => {
    try {
      const user = JSON.parse(localStorage.getItem("token"));
      const response = await axios.get(
        `https://phutungxemay.onrender.com/v1/delivery/${user?._id}/${orderId}`
      );
      const updatedOrders = orders.map((order) => {
        if (order._id === orderId) {
          return { ...order, histories: response.data };
        }
        return order;
      });
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error fetching order histories:", error);
    }
  };

  return (
    <div className="order-page container">
      <h1>Đơn Hàng Của Bạn</h1>
      {orders.length === 0 ? (
        <p>Chưa có đơn nào!</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order._id} className="order-item">
              <h2>Mã Đơn: {order._id}</h2>
              <p>Số lượng đã giao: {order.totalQuantity}</p>
              <p>Tạm tính: {`${numeral(order.totalPrice).format("0,0")}đ`}</p>
              <p>
                Tạm tính lãi: {`${numeral(order.totalProfit).format("0,0")}đ`}
              </p>
              <h3>Sản phẩm:</h3>
              <table className="product-list">
                <thead>
                  <tr>
                    <th>Mã sản phẩm</th>
                    <th>Số lượng đặt</th>
                    <th>Số lượng đã giao</th>
                    <th>Trạng thái</th>
                    <th>Giá bán</th>
                    <th>Tổng</th>
                    <th>Tiền lời</th>
                    <th>Tổng lời tạm tính</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((product) => (
                    <tr key={product._id}>
                      <td>{product.productCode}</td>
                      <td>{product.quantityOrdered}</td>
                      <td>{product.quantityDelivered}</td>
                      <td>
                        {product.deliveryStatus === "pending"
                          ? "Chưa giao xong"
                          : "Hoàn Thành"}
                      </td>
                      <td>{`${numeral(product.productPrice).format(
                        "0,0"
                      )}đ`}</td>
                      <td>{`${numeral(product.totalPrice).format("0,0")}đ`}</td>
                      <td>{`${numeral(product.productProfit).format(
                        "0,0"
                      )}đ`}</td>
                      <td>{`${numeral(product.totalProfit).format(
                        "0,0"
                      )}đ`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {order.histories ? (
                <>
                  <h3>Lịch sử</h3>
                  <table className="history-list">
                    <thead>
                      <tr>
                        <th>Ngày giao</th>
                        <th>Giao cho khách hàng</th>
                        <th>Mã sản phẩm</th>
                        <th>Đã giao</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.histories.map((history) => (
                        <tr key={history._id}>
                          <td>
                            {moment(history.deliveryDate).format("DD/MM/YYYY")}
                          </td>
                          <td>{history.customerId}</td>
                          <td>{history.productCode}</td>
                          <td>{history.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <button onClick={() => fetchOrderHistories(order._id)}>
                  Xem lịch sử đơn hàng
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
