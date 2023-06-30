import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";
import numeral from "numeral";
import Menu from "../menu/Menu";
export const OrderCustomer = () => {
  const [orders, setOrders] = useState([]);
  const [expandedCombos, setExpandedCombos] = useState([]);
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8000/v1/ordercombo"); // Replace with your actual API endpoint
      setOrders(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleToggleComboProducts = (orderId, comboId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order._id === orderId) {
          const updatedCombos = order.combos.map((combo) => {
            if (combo._id === comboId) {
              return {
                ...combo,
                showProducts: !combo.showProducts,
              };
            }
            return combo;
          });
          return {
            ...order,
            combos: updatedCombos,
          };
        }
        return order;
      })
    );
  };

  return (
    <div className="row">
      <div className="col-3">
        <Menu />
      </div>
      <div className="col-9">
        <div className="order-list container">
          {orders.map((order, index) => (
            <div key={order._id} className="order">
              <h2 style={{ fontSize: "15px", color: "green" }}>
                Khách hàng: {order.name}
              </h2>
              <h2 style={{ fontSize: "15px", color: "green" }}>
                Đơn Hàng: {index + 1}
              </h2>
              <h2 style={{ fontSize: "15px", color: "green" }}>
                Mã Đơn Hàng: {order._id}
              </h2>
              <h3 style={{ margin: "1rem 0" }}>Sản phẩm Máy PHOTOCOPY:</h3>

              <ul className="product-list">
                {order.products.map((product) => (
                  <li key={product._id} className="product">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="product-image"
                    />
                    <div className="product-details">
                      <h3>{product.title}</h3>
                      <p>
                        Giá: {`${numeral(product.newPrice).format("0,0")}đ`}{" "}
                      </p>
                      <p>Số lượng đặt: {product.quantity_cart}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <hr className="divider" />
              {order.combos.length > 0 ? (
                <>
                  <h3 style={{ margin: "1rem 0" }}>Combos:</h3>
                  <ul className="combo-list">
                    {order.combos.map((combo) => (
                      <li key={combo._id} className="combo">
                        <h4 style={{ fontSize: "15px", fontWeight: "bold" }}>
                          Tên Combo: {combo.comboName}
                        </h4>
                        <p>Số lượng đặt: {combo.quantityCombo}</p>
                        <p>
                          Tổng tiền:{" "}
                          {`${numeral(
                            combo.quantityCombo * combo.subtotal
                          ).format("0,0")}đ`}{" "}
                        </p>
                        <button
                          style={{ background: "blue" }}
                          className="toggle-combo-products-btn"
                          onClick={() =>
                            handleToggleComboProducts(order._id, combo._id)
                          }
                        >
                          {combo.showProducts ? "Ẩn" : "Xem thêm"}
                        </button>
                        {combo.showProducts ? (
                          combo.products.length > 0 ? (
                            <table className="combo-products-table">
                              <thead>
                                <tr>
                                  <th>Tên sản phẩm</th>
                                  <th>Giá</th>
                                  <th>Số lượng đặt</th>
                                </tr>
                              </thead>
                              <tbody>
                                {combo.products.map((product) => (
                                  <tr
                                    key={product._id}
                                    className="combo-product"
                                  >
                                    <td>{product.title}</td>
                                    <td>{`${numeral(product.price).format(
                                      "0,0"
                                    )}đ`}</td>
                                    <td>{product.quantity}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p style={{ color: "red" }}>
                              Hiện tại chưa có sản phẩm combo nào cho order này.
                            </p>
                          )
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p style={{ color: "red" }}>
                  Hiện tại chưa có sản phẩm combo nào cho order này.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
