import axios from "axios";
import React, { useEffect, useState } from "react";
import CustomizedBreadcrumbs from "../../../components/customizedBreadcrumbs/CustomizedBreadcrumbs";
import "./style.css";
import Button from "@mui/material/Button";
import numeral from "numeral";
import Logo from "../../../assets/logo.jpg";
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
          `http://localhost:8000/v1/ordercombo/${user?._id}`
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
            <h1 class="company-name">Cửa Hàng PHOTOCOPY LAM ANH</h1>
            <p class="company-name">Hóa Đơn Của Bạn</p>
            ${orders
              .map(
                (order, index) => `
              <div class="bill-header">
                <div class="bill-info">
                  <h2>Đơn hàng: ${index + 1}</h2>
                </div>
               
              </div>
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
              <ul class="product-list">
                ${order.combos
                  .map((combo) => {
                    return `
                      <li class="product-item">
                      <img class="product-image" src="${combo.image}" alt="${
                      combo.comboName
                    }">
                        <div class="product-details">
                          <h3>${combo.comboName}</h3>
                          <p>Số lượng: ${combo.quantity}</p>
                          <p>Giá:${numeral(combo.subtotal).format("0,0")}đ</p>
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
            `
              )
              .join("")}
            <p class="total-price">Tổng tiền: ${numeral(totalOrderPrice).format(
              "0,0"
            )}đ</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
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
                <h2>Các đơn Máy PHOTOCOPY</h2>
                <Button
                  variant="contained"
                  onClick={() => handlePrintInvoice(orders, totalOrderPrice)}
                >
                  In hóa đơn
                </Button>
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
    </>
  );
};

export default PurchaseHistory;
