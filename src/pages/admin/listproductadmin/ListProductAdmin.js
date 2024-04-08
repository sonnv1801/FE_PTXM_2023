import React, { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";
import Menu from "../menu/Menu";
import {
  deleteProductToOrder,
  getAllProToOrders,
} from "../../../redux/actions/order.action";
import { Loading } from "../../../components/loading/Loading";
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
        <div className="col-3 menu-admin-dt">
          <Menu />
        </div>
        <div className="col-xl-9 col-sm-12">
          <div className="title-list">
            <div className="row">
              <div className="col-sm-5">
                <p>Quản lý Phụ Tùng</p>
              </div>
            </div>
          </div>
          <div className="sm-product-admin">
            <div className="table_responsive">
              <table>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Ảnh</th>
                    <th>Tên Sản phẩm</th>
                    <th>Số Lượng Còn</th>
                    <th>Mặt hàng</th>
                    <th>Giá</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="3">
                        <Loading />
                      </td>
                    </tr>
                  ) : (
                    <>
                      {getAllProductToOrders?.map((item, index) => (
                        <tr key={item._id}>
                          <td>{index + 1}</td>
                          <td>
                            <img src={item.image} alt={item.name} />
                          </td>
                          <td>{item.name}</td>
                          <td>
                            {item.quantityDelivered === item.quantityPurchased
                              ? "Hết Hàng"
                              : `Còn Hàng ${
                                  item.quantityDelivered -
                                  item.quantityPurchased
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
      </div>
    </div>
  );
}

export default ListProductAdmin;
