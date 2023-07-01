import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";
import "react-toastify/dist/ReactToastify.css";
import numeral from "numeral";
import moment from "moment";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [supplierFilter, setSupplierFilter] = useState("");
  const [deliveryDateFilter, setDeliveryDateFilter] = useState({});
  const [productTypeFilter, setProductTypeFilter] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, supplierFilter, deliveryDateFilter, productTypeFilter]);

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

  const applyFilters = () => {
    let filteredOrders = orders;

    // Apply supplier filter
    if (supplierFilter) {
      filteredOrders = filteredOrders.filter((order) => {
        return order.products.some(
          (product) => product.supplier === supplierFilter
        );
      });
    }

    // Apply product type filter
    if (productTypeFilter) {
      filteredOrders = filteredOrders.filter((order) => {
        return order.products.some((product) => {
          return (
            product.type === productTypeFilter &&
            product.supplier === supplierFilter
          );
        });
      });
    }

    setFilteredOrders(filteredOrders);
  };
  const calculateTotalValues = (orders) => {
    const totalValues = {
      price: 0,
      total: 0,
      profit: 0,
      totalProfit: 0,
      quantityOrdered: 0,
      quantityDelivered: 0,
    };

    filteredOrders.forEach((order) => {
      order.products.forEach((product) => {
        totalValues.price += product.productPrice;
        totalValues.total += product.totalPrice;
        totalValues.profit += product.productProfit;
        totalValues.totalProfit += product.totalProfit;
        totalValues.quantityOrdered += product.quantityOrdered;
        totalValues.quantityDelivered += product.quantityDelivered;
      });
    });

    return totalValues;
  };

  const filteredTotalValues = calculateTotalValues(filteredOrders);

  return (
    <>
      <div className="order-page container">
        <h1>Đơn Hàng Của Bạn</h1>
        <Link to="/admin">
          <Button
            variant="outlined"
            endIcon={<ArrowRightIcon />}
            // onClick={handlePurchase}
            style={{ margin: "0", marginLeft: "1rem" }}
          >
            Quay Lại Admin
          </Button>
        </Link>
        {orders.length === 0 ? (
          <p>Chưa có đơn nào!</p>
        ) : (
          <div className="order-list">
            <div className="filters">
              <label htmlFor="supplier-filter">Nhà cung cấp:</label>
              <select
                id="supplier-filter"
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
              >
                <option value="">Tất cả</option>
                {/* Render supplier options dynamically */}
                {orders
                  .flatMap((order) =>
                    order.products.map((product) => product.supplier)
                  )
                  .filter(
                    (supplier, index, suppliers) =>
                      suppliers.indexOf(supplier) === index
                  )
                  .map((supplier) => (
                    <option value={supplier} key={supplier}>
                      {supplier}
                    </option>
                  ))}
              </select>

              <label htmlFor="delivery-date-start">Từ ngày:</label>
              <input
                type="date"
                id="delivery-date-start"
                value={deliveryDateFilter.startDate || ""}
                onChange={(e) =>
                  setDeliveryDateFilter((prevState) => ({
                    ...prevState,
                    startDate: e.target.value,
                  }))
                }
              />

              <label htmlFor="delivery-date-end">Đến ngày:</label>
              <input
                type="date"
                id="delivery-date-end"
                value={deliveryDateFilter.endDate || ""}
                onChange={(e) =>
                  setDeliveryDateFilter((prevState) => ({
                    ...prevState,
                    endDate: e.target.value,
                  }))
                }
              />

              <label htmlFor="product-type-filter">Loại sản phẩm:</label>
              <select
                id="product-type-filter"
                value={productTypeFilter}
                onChange={(e) => setProductTypeFilter(e.target.value)}
              >
                <option value="">Tất cả</option>
                {/* Render product type options dynamically */}
                {orders
                  .flatMap((order) =>
                    order.products.map((product) => product.type)
                  )
                  .filter((type, index, types) => types.indexOf(type) === index)
                  .map((type) => (
                    <option value={type} key={type}>
                      {type}
                    </option>
                  ))}
              </select>
            </div>

            {filteredOrders.length === 0 ? (
              <p>Không có đơn hàng phù hợp với các bộ lọc.</p>
            ) : (
              <div>
                <div className="order-list">
                  {filteredOrders.map((order) => (
                    <div key={order._id} className="order-item">
                      <div key={order._id} className="order-item">
                        <h2>Mã Đơn: {order._id}</h2>
                        <p>Số lượng đã giao: {order.totalQuantity}</p>
                        <p>
                          Tạm tính:{" "}
                          {`${numeral(order.totalPrice).format("0,0")}đ`}
                        </p>
                        <p>
                          Tạm tính lãi:{" "}
                          {`${numeral(order.totalProfit).format("0,0")}đ`}
                        </p>
                        <h3>Sản phẩm:</h3>
                        <table className="product-list">
                          <thead>
                            <tr>
                              <th>Mã sản phẩm</th>
                              <th>Nhà Cung Cấp</th>
                              <th>Loại Sản Phẩm</th>
                              <th>Số lượng đặt</th>
                              <th>Số lượng đã giao</th>
                              <th>Trạng thái</th>
                              <th>Giao Hàng</th>
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
                                <td>{product.supplier}</td>
                                <td>{product.type}</td>
                                <td>{product.quantityOrdered}</td>
                                <td>{product.quantityDelivered}</td>
                                <td>
                                  {product.deliveryStatus === "pending"
                                    ? "Chưa giao xong"
                                    : "Hoàn Thành"}
                                </td>
                                <td>
                                  {product.fastDelivery === true
                                    ? "Giao Hàng Nhanh"
                                    : "Giao Hàng Thường"}
                                </td>
                                <td>{`${numeral(product.productPrice).format(
                                  "0,0"
                                )}đ`}</td>
                                <td>{`${numeral(product.totalPrice).format(
                                  "0,0"
                                )}đ`}</td>
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
                                      {moment(history.deliveryDate).format(
                                        "DD/MM/YYYY"
                                      )}
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
                          <button
                            onClick={() => fetchOrderHistories(order._id)}
                          >
                            Xem lịch sử đơn hàng
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <table className="product-list">
                    <thead>
                      <tr>
                        <th>Tổng Số Lượng Đặt</th>
                        <th>Tổng Số lượng đã giao</th>
                        <th>Tổng Giá Bán</th>
                        <th>Tổng Tiền</th>
                        <th>Tổng Tiền Lời</th>
                        <th>Tổng Lời</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{filteredTotalValues.quantityOrdered}</td>
                        <td>{filteredTotalValues.quantityDelivered}</td>
                        <td>
                          {numeral(filteredTotalValues.price).format("0,0")}đ
                        </td>
                        <td>
                          {numeral(filteredTotalValues.total).format("0,0")}đ
                        </td>
                        <td>
                          {numeral(filteredTotalValues.profit).format("0,0")}đ
                        </td>
                        <td>
                          {numeral(filteredTotalValues.totalProfit).format(
                            "0,0"
                          )}
                          đ
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default OrderPage;
