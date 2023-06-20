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
import {
  addProduct,
  deleteProduct,
  getProducts,
} from "../../../redux/actions/product.action";
import { getAllTypeProduct } from "../../../redux/actions/type.action";
import Menu from "../menu/Menu";
function ListProductAdmin() {
  const [showadd, setShowadd] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("token"));
  const isLoading = useSelector((state) => state.defaultReducer.isLoading);
  const listProducts = useSelector(
    (state) => state.defaultReducer.listProducts
  );
  const [data, setData] = useState({
    title: "",
    image: "",
    type: "",
    description: "",
    newPrice: "",
    oldPrice: "",
    quantity: "",
    code: "",
  });

  const handleChange = (name) => (e) => {
    const value = name === "image" ? e.target.files[0] : e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (
        data.title !== "" &&
        data.code !== "" &&
        data.image !== "" &&
        data.type !== "" &&
        data.description !== "" &&
        data.newPrice !== "" &&
        data.oldPrice !== "" &&
        data.quantity !== ""
      ) {
        let formData = new FormData();
        formData.append("image", data.image);
        formData.append("title", data.title);
        formData.append("code", data.code);
        formData.append("type", data.type);
        formData.append("description", data.description);
        formData.append("newPrice", data.newPrice);
        formData.append("oldPrice", data.oldPrice);
        formData.append("quantity", data.quantity);

        dispatch(addProduct(formData, currentUser?.accessToken));
        setShowadd(false);
      } else {
        toast.error("Thêm sản phẩm thất bại!", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleCloseAdd = () => {
    setShowadd(false);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
  }, []);

  const listTypes = useSelector((state) => state.defaultReducer.listType);
  useEffect(() => {
    dispatch(getAllTypeProduct());
  }, []);

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
              <div className="col-sm-7">
                <button
                  href="#"
                  className="btn btn-outline-danger"
                  onClick={() => {
                    setShowadd(true);
                  }}
                >
                  <i className="bx bxs-folder-plus"></i>
                  <span>Thêm Phụ Tùng</span>
                </button>
              </div>
            </div>
          </div>
          <table className="table">
            <thead classNane="table-dark">
              <tr>
                <th>STT</th>
                <th>Ảnh</th>
                <th>Tên Sản phẩm</th>
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
                  {listProducts?.map((item, index) => (
                    <tr>
                      <td>{index}</td>
                      <td>
                        <img src={item.image} alt={item.title} />
                      </td>
                      <td>{item.title}</td>

                      <td>{item.type}</td>
                      <td>
                        <p>{`${item.newPrice.toLocaleString()}đ`}</p>
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
                              deleteProduct(item._id, currentUser?.accessToken)
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

      <Modal show={showadd} onHide={handleCloseAdd} className="modal">
        <ModalHeader>
          <ModalTitle>Thêm sản phẩm</ModalTitle>
        </ModalHeader>
        <ModalBody className="modal-body">
          <Form.Group className="formgroup-body">
            <Form.Label>Tên sản phẩm: </Form.Label>
            <Form.Control
              type="text"
              onChange={handleChange("title")}
              placeholder="Nhập tên sản phẩm..."
            />
            <Form.Label>Mã sản phẩm: </Form.Label>
            <Form.Control
              type="text"
              onChange={handleChange("code")}
              placeholder="Nhập mã sản phẩm..."
            />
            <Form.Label>Loại sản phẩm: </Form.Label>
            <Form.Select
              aria-label="Default select example"
              onChange={handleChange("type")}
            >
              <option>Chọn loại sản phẩm</option>
              {listTypes?.map((item, index) => (
                <option value={item?.name}>{item.name}</option>
              ))}
            </Form.Select>
            <Form.Label>Mô tả sản phẩm: </Form.Label>
            <textarea
              className="form-control"
              type="text"
              onChange={handleChange("description")}
            />
            <Form.Label>Giá mới: </Form.Label>
            <Form.Control
              type="number"
              onChange={handleChange("newPrice")}
              placeholder="Nhập giá sản phẩm..."
            />
            <Form.Label>Giá cũ: </Form.Label>
            <Form.Control
              type="number"
              onChange={handleChange("oldPrice")}
              placeholder="Nhập giá cũ sản phẩm..."
            />
            <Form.Label>Số lượng sản phẩm: </Form.Label>
            <Form.Select
              aria-label="Default select example"
              onChange={handleChange("quantity")}
            >
              <option>Chọn số lượng sản phẩm</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </Form.Select>
          </Form.Group>
          <Form.Label>Hình ảnh: </Form.Label>
          <Form.Control
            type="file"
            size="sm"
            accept="image/*"
            name="image"
            onChange={handleChange("image")}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="success" onClick={handleSubmit}>
            Thêm Sản Phẩm
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ListProductAdmin;
