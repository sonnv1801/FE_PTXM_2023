import axios from "axios";
import React, { useEffect, useState } from "react";
import CustomizedBreadcrumbs from "../../../components/customizedBreadcrumbs/CustomizedBreadcrumbs";
import "./style.css";
import Button from "@mui/material/Button";
import numeral from "numeral";

const PurchaseHistory = ({ customerId }) => {
  const [orders, setOrders] = useState([]);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [totalOrderPrice, setTotalOrderPrice] = useState(0);

  const calculateTotalOrderPrice = (orders) => {
    let total = 0;
    orders.forEach((order) => {
      order.products.forEach((product) => {
        total += product.quantity_cart * product.newPrice;
      });
      order.combos.forEach((combo) => {
        total += combo.subtotal;
      });
    });
    setTotalOrderPrice(total);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("token"));
        const response = await axios.get(
          `https://phutungxemay.onrender.com/v1/ordercombo/${user?._id}`
        );
        setOrders(response.data);
        calculateTotalOrderPrice(response.data); // Call the function to calculate the total order price
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [customerId]);

  const handleComboClick = (combo) => {
    if (selectedCombo && selectedCombo.id === combo.id) {
      setSelectedCombo(null); // Đã bấm vào đơn hàng đã được chọn, bấm lần nữa để ẩn đi
    } else {
      setSelectedCombo(combo); // Bấm vào đơn hàng chưa được chọn, hiển thị sản phẩm của đơn hàng đó
    }
  };

  return (
    <div className="purchase-history container">
      <div className="link-history">
        <CustomizedBreadcrumbs name={"Đơn hàng của bạn"} />
      </div>
      {orders.length === 0 ? (
        <p>Bạn Chưa có đơn hàng nào?</p>
      ) : (
        <div className="body-history">
          <div className="sub-body-history">
            <div className="title-history">
              <h2>Các đơn Phụ tùng</h2>
            </div>
            <div className="prd-history">
              <div className="row">
                <div className="col-2">
                  <label>Hình Ảnh</label>
                </div>
                <div className="col-2">
                  <label>Sản phẩm</label>
                </div>
                <div className="col-2">
                  <label>Mã</label>
                </div>
                <div className="col-2">
                  <label>Số lượng đặt</label>
                </div>
                <div className="col-2">
                  <label>Giá</label>
                </div>
                <div className="col-2">
                  <label>Tổng tiền</label>
                </div>
              </div>
            </div>
            <div className="prd-history-sub">
              {orders.map((order) => (
                <>
                  {order.products.map((product) => (
                    <div style={{ padding: "1.5rem 0" }}>
                      <div className="row">
                        <div className="col-2">
                          <label style={{ width: "50px", height: "50px" }}>
                            <img
                              src={product.image}
                              alt={product.title}
                              style={{ width: "100%" }}
                            />
                          </label>
                        </div>
                        <div className="col-2">
                          <label>{product.title}</label>
                        </div>
                        <div className="col-2">
                          <label>{product.code}</label>
                        </div>
                        <div className="col-2">
                          <label>{product.quantity_cart}</label>
                        </div>
                        <div className="col-2">
                          <label>{`${numeral(product.newPrice).format(
                            "0,0"
                          )}đ`}</label>
                        </div>
                        <div className="col-2">
                          <label>
                            {`${numeral(
                              product.quantity_cart * product.newPrice
                            ).format("0,0")}đ`}
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>
          <div className="sub-body-history">
            <div className="title-history">
              <h2>Các đơn Combo</h2>
            </div>
            <div className="prd-history">
              <div className="row">
                <div className="col-2">
                  <label>Hình Ảnh</label>
                </div>
                <div className="col-2">
                  <label>Sản phẩm</label>
                </div>
                <div className="col-2">
                  <label>Số lượng sản phẩm có trong Combo</label>
                </div>
                <div className="col-2">
                  <label>Số lượng Combo</label>
                </div>
                <div className="col-2">
                  <label>Giá Mỗi Combo</label>
                </div>
                <div className="col-2">
                  <label>Tổng tiền</label>
                </div>
              </div>
            </div>
            <div className="prd-history-sub">
              {orders.map((order) => (
                <div>
                  {order.combos.map((combo) => (
                    <div>
                      <div style={{ padding: "1.5rem 0", cursor: "pointer" }}>
                        <div className="row">
                          <div className="col-2">
                            <label style={{ width: "50px", height: "50px" }}>
                              <img
                                src={combo.image}
                                alt={combo.title}
                                style={{ width: "100%" }}
                              />
                            </label>
                          </div>
                          <div className="col-2">
                            <label>{combo.comboName}</label>
                          </div>
                          <div className="col-2">
                            <label>{combo.quantity}</label>
                          </div>
                          <div className="col-2">
                            <label>{combo.quantityCombo}</label>
                          </div>
                          <div className="col-2">
                            <label>{`${numeral(combo.subtotal).format(
                              "0,0"
                            )}đ`}</label>
                          </div>
                          <div className="col-2">
                            <label>{`${numeral(
                              combo.subtotal * combo.quantityCombo
                            ).format("0,0")}đ`}</label>
                          </div>
                        </div>
                      </div>
                      <hr />
                    </div>
                  ))}
                  {/* {orders.map((order) => (
                    <div>
                      <p> Tất cả sản phẩm có trong combo:</p>

                      <div className="prd-history">
                        <div className="row">
                          <div className="col-2">
                            <label>Hình Ảnh</label>
                          </div>
                          <div className="col-2">
                            <label>Sản phẩm</label>
                          </div>
                          <div className="col-2">
                            <label>Mã sản phẩm</label>
                          </div>
                          <div className="col-2">
                            <label>Số lượng</label>
                          </div>
                          <div className="col-2">
                            <label>Giá</label>
                          </div>
                          <div className="col-2">
                            <label>Tổng Tiền</label>
                          </div>
                        </div>
                      </div>
                      {order.combos.map((product) => (
                        <div
                          style={{ padding: "1.5rem 0" }}
                          key={product.productId}
                        >
                          <div className="row">
                            <div className="col-2">
                              <label style={{ width: "50px", height: "50px" }}>
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  style={{ width: "100%" }}
                                />
                              </label>
                            </div>
                            <div className="col-2">
                              <label>{product.name}</label>
                            </div>
                            <div className="col-2">
                              <label>{product.productCode}</label>
                            </div>
                            <div className="col-2">
                              <label>{product.quantity}</label>
                            </div>
                            <div className="col-2">
                              <label>{product.price}</label>
                            </div>
                            <div className="col-2">
                              <label>{product.total}</label>
                            </div>
                          </div>
                        </div>
                      ))}
                      <hr />
                    </div>
                  ))} */}
                </div>
              ))}
            </div>
            <div className="status-history">
              <div className="row">
                <div className="col-12">
                  <div className="status-orders">
                    <div className="sub-status-orders">
                      <b>Tổng Tiền:</b>
                      <b>{`${numeral(totalOrderPrice).format("0,0")}đ`}</b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
