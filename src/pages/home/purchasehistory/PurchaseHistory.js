import axios from "axios";
import React, { useEffect, useState } from "react";
import CustomizedBreadcrumbs from "../../../components/customizedBreadcrumbs/CustomizedBreadcrumbs";
import "./style.css";
import Button from "@mui/material/Button";
import numeral from "numeral";
import Logo from "../../../assets/logo1.png";
import { Link } from "react-router-dom";
import { Loading } from "../../../components/loading/Loading";
const PurchaseHistory = ({ customerId }) => {
  const [orders, setOrders] = useState([]);
  const [totalOrderPrice, setTotalOrderPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  const calculateTotalOrderPrice = (orders) => {
    let total = 0;
    orders?.forEach((order) => {
      order.products?.forEach((product) => {
        total += product.quantity_cart * product.newPrice;
      });
      order.combos?.forEach((combo) => {
        total += combo.subtotal * combo.quantityCombo;
      });
    });
    setTotalOrderPrice(total);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("token"));
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/v1/ordercombo/history/${user?._id}`
        );
        setOrders(response.data);
        calculateTotalOrderPrice(response.data); // Call the function to calculate the total order price
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId]);

  const handlePrintInvoice = (orders, totalOrderPrice) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Hóa đơn</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
  
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ccc;
              background-color: #fff;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
  
            .company-logo {
              max-width: 96px;
              border-radius: 1rem;
              height: auto;
              display: block;
              margin: 0 auto;
              margin-bottom: 20px;
            }
  
            .company-name {
              font-size: 24px;
              font-weight: bold;
              text-align: center;
              margin: 0;
              margin-bottom: 20px;
            }
  
            .bill-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
            }
  
            .bill-header .bill-info {
              display: flex;
              flex-direction: column;
            }
  
            .bill-header .bill-info h2 {
              font-size: 18px;
              font-weight: normal;
              margin: 0;
            }
  
            .bill-header .bill-info p {
              font-size: 14px;
              margin: 0;
            }
  
            .bill-header .bill-logo {
              max-width: 100px;
              height: auto;
            }
  
            .product-list {
              list-style-type: none;
              padding: 0;
            }
  
            .product-item {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #ccc;
            }
  
            .product-item:last-child {
              border-bottom: none;
            }
  
            .product-item .product-image {
              width: 80px;
              height: 80px;
              object-fit: cover;
              margin-right: 10px;
            }
  
            .product-item .product-details {
              flex-grow: 1;
            }
  
            .product-item .product-details h3 {
              font-size: 16px;
              margin: 0;
            }
  
            .product-item .product-details p {
              font-size: 14px;
              margin: 0;
            }
  
            .product-item .product-price {
              font-size: 16px;
              font-weight: bold;
            }
  
            .total-price {
              font-size: 20px;
              font-weight: bold;
              margin-top: 30px;
              text-align: right;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <img class="company-logo" src= "${Logo}" alt="Company Logo">
            <h1 class="company-name">PHỤ TÙNG XE MÁY VĂN SƠN</h1>
            <p class="company-name">Hóa Đơn Của Bạn</p>
                ${orders
                  .map((order, index) => {
                    let orderContent = `
                <div class="bill-header">
                  <div class="bill-info">
                    <h2>Chi Tiết Đơn Hàng Của Bạn</h2>
                  </div>
                </div>
              `;

                    if (order.products.length > 0) {
                      orderContent += `
                  <ul class="product-list">
                    ${order.products
                      .map((product) => {
                        return `
                          <li class="product-item">
                            <img class="product-image" src="${
                              product.image
                            }" alt="${product.title}">
                            <div class="product-details">
                              <h3>${product.title}</h3>
                              <p>Số lượng đặt: ${product.quantity_cart}</p>
                              <p>Giá: ${numeral(product.newPrice).format(
                                "0,0"
                              )}đ</p>
                            </div>
                            <div class="product-price">${numeral(
                              product.quantity_cart * product.newPrice
                            ).format("0,0")}đ</div>
                          </li>
                        `;
                      })
                      .join("")}
                  </ul>
                  <hr/>
                `;
                    }

                    if (order.combos.length > 0) {
                      orderContent += `
                  <ul class="product-list">
                    ${order.combos
                      .map((combo) => {
                        return `
                          <li class="product-item">
                            <img class="product-image" src="${
                              combo.image
                            }" alt="${combo.comboName}">
                            <div class="product-details">
                              <h3>${combo.comboName}</h3>
                              <p>Số lượng: ${combo.quantity}</p>
                              <p>Giá:${numeral(combo.subtotal).format(
                                "0,0"
                              )}đ</p>
                            </div>
                            <div class="product-price">${numeral(
                              combo.subtotal * combo.quantity
                            ).format("0,0")}đ</div>
                          </li>
                        `;
                      })
                      .join("")}
                  </ul>
                  <hr/>
                `;
                    }

                    return orderContent;
                  })
                  .join("")}
          <p class="total-price">Tổng tiền: ${numeral(totalOrderPrice).format(
            "0,0"
          )}đ</p>
        </div>
        </body>
      </html>
    `);
    // printWindow.document.close();
    // printWindow.print();
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="purchase-history container">
          <div className="link-history">
            <CustomizedBreadcrumbs name={"Đơn hàng của bạn"} />
            <Button
              variant="contained"
              onClick={() => handlePrintInvoice(orders, totalOrderPrice)}
            >
              In hóa đơn
            </Button>
          </div>
          {orders.length === 0 ? (
            <div className="alert alert-warning" role="alert">
              Hiện Tại Bạn Chưa Mua Sản Phẩm Nào!
              <Link to="/">
                <a className="btn btn-primary ml-2">Mua Thêm</a>
              </Link>
            </div>
          ) : (
            <div className="body-history">
              {orders.some(
                (order) => order.products && order.products.length > 0
              ) && (
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
                  <div className="prd-history sm-prd-history">
                    <div className="row">
                      <div className="col-4">
                        <label>Sản phẩm</label>
                      </div>
                      <div className="col-4">
                        <label>Mã</label>
                      </div>
                      <div className="col-4">
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
                                <label
                                  style={{ width: "50px", height: "50px" }}
                                >
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
                  <div className="prd-history-sub sm-prd-history-sub">
                    {orders.map((order) => (
                      <>
                        {order.products.map((product) => (
                          <div style={{ padding: "1.5rem 0" }}>
                            <div className="row">
                              <div className="col-4">
                                <label className="sm-lablel-titles">
                                  {product.title}
                                </label>
                              </div>
                              <div className="col-4">
                                <label className="sm-label-codes">
                                  {product.code}
                                </label>
                              </div>
                              <div className="col-4">
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
              )}
              {orders.some(
                (order) => order.combos && order.combos.length > 0
              ) && (
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
                  <div className="prd-history sm-prd-history">
                    <div className="row">
                      <div className="col-4">
                        <label>Sản phẩm</label>
                      </div>
                      <div className="col-4">
                        <label>Giá Mỗi Combo</label>
                      </div>
                      <div className="col-4">
                        <label>Tổng tiền</label>
                      </div>
                    </div>
                  </div>
                  <div className="prd-history-sub">
                    {orders.map((order) => (
                      <div>
                        {order.combos.map((combo) => (
                          <div>
                            <div
                              style={{ padding: "1.5rem 0", cursor: "pointer" }}
                            >
                              <div className="row">
                                <div className="col-2">
                                  <label
                                    style={{ width: "50px", height: "50px" }}
                                  >
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
                      </div>
                    ))}
                  </div>
                  <div className="prd-history-sub sm-prd-history-sub">
                    {orders.map((order) => (
                      <div>
                        {order.combos.map((combo) => (
                          <div>
                            <div
                              style={{ padding: "1.5rem 0", cursor: "pointer" }}
                            >
                              <div className="row">
                                <div className="col-4">
                                  <label>{combo.comboName}</label>
                                </div>
                                <div className="col-4">
                                  <label>{`${numeral(combo.subtotal).format(
                                    "0,0"
                                  )}đ`}</label>
                                </div>
                                <div className="col-4">
                                  <label>{`${numeral(
                                    combo.subtotal * combo.quantityCombo
                                  ).format("0,0")}đ`}</label>
                                </div>
                              </div>
                            </div>
                            <hr />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div
                className="status-history"
                style={{ padding: "0.5rem 1.5rem" }}
              >
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
          )}
        </div>
      )}
    </>
  );
};

export default PurchaseHistory;
