import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import Form from "react-bootstrap/Form";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { deleteProduct } from "../../../redux/actions/product.action";
import Menu from "../menu/Menu";
import {
  deleteProductToOrder,
  getAllProToOrders,
} from "../../../redux/actions/order.action";
function ListProductAdmin() {
  const currentUser = JSON.parse(localStorage.getItem("token"));
  const isLoading = useSelector((state) => state.defaultReducer.isLoading);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProToOrders());
  }, []);

  const getAllProductToOrders = useSelector(
    (state) => state.defaultReducer.listProductToOrder
  );

  return (
    <div className="container-listproductAd">
      <div className="row">
        <div className="col-3">
          <Menu />
        </div>
        <div className="col-9">
          <div className="title-list">
            <div className="row">
              <div className="col-sm-5">
                <p>Quản lý Phụ Tùng</p>
              </div>
            </div>
          </div>
          <table className="table">
            <thead classNane="table-dark">
              <tr>
                <th>STT</th>
                <th>Ảnh</th>
                <th>Tên Sản phẩm</th>
                <th>Số Lượng Còn</th>
                <th>Mặt hàng</th>
                <th>Giá</th>
                <th>Sửa</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <div
                  className="spinner-border"
                  role="status"
                  style={{ margin: "0 auto" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <>
                  {getAllProductToOrders?.map((item, index) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>
                        <img src={item.image} alt={item.name} />
                      </td>
                      <td>{item.name}</td>
                      <td>
                        {" "}
                        {item.quantityDelivered === item.quantityPurchased
                          ? "Hết Hàng"
                          : `Còn Hàng ${
                              item.quantityDelivered - item.quantityPurchased
                            } Cái`}
                      </td>

                      <td>{item.type}</td>
                      <td>
                        <p>{`${item.retailPrice?.toLocaleString()}đ`}</p>
                      </td>
                      <td>
                        <Link to={`/list-products-admin/${item._id}`}>
                          <button className="btn btn-success">
                            <i className="fa fa-edit"></i>
                          </button>
                        </Link>
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            dispatch(
                              deleteProductToOrder(
                                item._id,
                                currentUser?.accessToken
                              )
                            );
                          }}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ListProductAdmin;
