import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";
import numeral from "numeral";
import Menu from "../menu/Menu";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalTitle from "react-bootstrap/ModalTitle";

import Form from "react-bootstrap/Form";
export const OrderCustomer = () => {
  const [orders, setOrders] = useState([]);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [showadd, setShowadd] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleCloseAdd = () => {
    setShowadd(false);
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrderById = async (orderId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/v1/ordercombo/info/${orderId}`
      );
      setSelectedOrder(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "${process.env.REACT_APP_API_URL}/v1/ordercombo"
      );
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

  const handleDeleteOrder = async (orderId) => {
    setIsCreatingProduct(true);
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/v1/ordercombo/${orderId}`
      );
      toast.success(`${response.data.message}`, {
        position: toast.POSITION.TOP_CENTER,
      });
      fetchOrders();
    } catch (error) {
      console.log(error);
    } finally {
      setIsCreatingProduct(false);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-3 menu-admin-dt">
          <Menu />
        </div>
        <div className="col-xl-9 col-sm-12">
          {orders.length === 0 ? (
            <div className="alert alert-warning m-3" role="alert">
              Hiện Tại Chưa Có Sản Phẩm Nào!
            </div>
          ) : (
            <div className="order-list container">
              {orders.map((order, index) => (
                <div key={index} className="order">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteOrder(order._id)}
                  >
                    {isCreatingProduct ? (
                      "Vui lòng chờ..."
                    ) : (
                      <i className="fa fa-trash"></i>
                    )}
                  </button>
                  <button
                    href="#"
                    className="btn btn-outline-danger"
                    onClick={() => {
                      fetchOrderById(order._id); // Fetch order details for the modal
                      setShowadd(true); // Show the modal
                    }}
                  >
                    <i className="bx bxs-folder-plus"></i>
                    <span>Thông Tin Khách Hàng</span>
                  </button>
                  <Modal
                    show={showadd}
                    onHide={handleCloseAdd}
                    className="modal"
                  >
                    <ModalHeader>
                      <ModalTitle>
                        Thông Tin Đơn Hàng {selectedOrder?.name}
                      </ModalTitle>
                    </ModalHeader>
                    <ModalBody className="modal-body">
                      {/* Render the selectedOrder details here */}
                      {selectedOrder && (
                        <>
                          <Form.Group className="formgroup-body">
                            <Form.Label>
                              Tên Khách Hàng: {selectedOrder.name}
                            </Form.Label>{" "}
                            <br />
                            <Form.Label>
                              Số Điện Thoại: {selectedOrder.phoneNumber}
                            </Form.Label>
                            <br />
                            <Form.Label>
                              Địa Chỉ Email: {selectedOrder.email}
                            </Form.Label>
                            <br />
                            <Form.Label>
                              Địa Chỉ Nhận Hàng: {selectedOrder.address}
                            </Form.Label>
                            <br />
                            <Form.Label>
                              Ghi Chú (Đơn Hàng): {selectedOrder.note}
                            </Form.Label>
                            <br />
                          </Form.Group>
                          {/* Add other customer information you want to display */}
                        </>
                      )}
                    </ModalBody>
                  </Modal>

                  <h2 style={{ fontSize: "15px", color: "green" }}>
                    Đơn Hàng: {index + 1}
                  </h2>
                  <h2 style={{ fontSize: "15px", color: "green" }}>
                    Mã Đơn Hàng: {order._id}
                  </h2>
                  <h3 style={{ margin: "1rem 0" }}>Sản phẩm phụ tùng:</h3>

                  <div className="table_responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Ảnh</th>
                          <th>Giá</th>
                          <th>Số lượng đặt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.products.map((product, index) => (
                          <tr key={product._id}>
                            <td>{index + 1}</td>
                            <td>
                              <img src={product.image} alt={product.title} />
                            </td>
                            <td>{`${numeral(product.newPrice).format(
                              "0,0"
                            )}đ`}</td>
                            <td>{product.quantity_cart}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <hr className="divider" />
                  {order.combos.length > 0 ? (
                    <>
                      <h3 style={{ margin: "1rem 0" }}>Combos:</h3>

                      <div className="table_responsive">
                        <table>
                          <thead>
                            <tr>
                              <th>STT</th>
                              <th>Tên Combo</th>
                              <th>Số lượng đặt</th>
                              <th>Tổng Tiền</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.combos.map((combo, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{combo.comboName}</td>
                                <td>{combo.quantityCombo}</td>
                                <td>
                                  {" "}
                                  {`${numeral(
                                    combo.quantityCombo * combo.subtotal
                                  ).format("0,0")}đ`}
                                </td>
                                <td>
                                  <button
                                    style={{ background: "blue" }}
                                    className="toggle-combo-products-btn"
                                    onClick={() =>
                                      handleToggleComboProducts(
                                        order._id,
                                        combo._id
                                      )
                                    }
                                  >
                                    {combo.showProducts ? "Ẩn" : "Xem thêm"}
                                  </button>
                                  {combo.showProducts ? (
                                    combo.products.length > 0 ? (
                                      <div className="table_responsive">
                                        <table>
                                          <thead>
                                            <tr>
                                              <th>Tên sản phẩm</th>
                                              <th>Giá</th>
                                              <th>Số lượng đặt</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {combo.products.map(
                                              (product, index) => (
                                                <tr
                                                  key={index}
                                                  className="combo-product"
                                                >
                                                  <td>{product.title}</td>
                                                  <td>{`${numeral(
                                                    product.price
                                                  ).format("0,0")}đ`}</td>
                                                  <td>{product.quantity}</td>
                                                </tr>
                                              )
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                    ) : (
                                      <p style={{ color: "red" }}>
                                        Hiện tại chưa có sản phẩm combo nào cho
                                        order này.
                                      </p>
                                    )
                                  ) : null}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <p style={{ color: "red" }}>
                      Hiện tại chưa có sản phẩm combo nào cho order này.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
