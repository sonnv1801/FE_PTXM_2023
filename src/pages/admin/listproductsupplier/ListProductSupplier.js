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
  deleteProduct,
  getProducts,
} from "../../../redux/actions/product.action";
import Menu from "../menu/Menu";
import {
  addProductSuppliers,
  deleteProductSupplier,
  getProductSupplier,
} from "../../../redux/actions/productSupplier.action";
import { getSupplier } from "../../../redux/actions/supplier.action";
import { getAllTypeProduct } from "../../../redux/actions/type.action";
function ListProductSupplier() {
  const [showadd, setShowadd] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("token"));
  const isLoading = useSelector((state) => state.defaultReducer.isLoading);
  const listProductSupplier = useSelector(
    (state) => state.defaultReducer.listProductSupplier
  );
  const [data, setData] = useState({
    name: "",
    image: "",
    supplier: "",
    agentCode: "",
    productCode: "",
    salePrice: "",
    retailPrice: "",
    wholesalePrice: "",
    quantity: "",
    link: "",
    type: "",
  });

  console.log(data, "data");

  const handleChange = (name) => (e) => {
    const value = name === "image" ? e.target.files[0] : e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (
        data.name !== "" &&
        data.image !== "" &&
        data.supplier !== "" &&
        data.agentCode !== "" &&
        data.productCode !== "" &&
        data.salePrice !== "" &&
        data.retailPrice !== "" &&
        data.wholesalePrice !== "" &&
        data.quantity !== "" &&
        data.link !== ""
      ) {
        let formData = new FormData();
        formData.append("name", data.name);
        formData.append("image", data.image);
        formData.append("supplier", data.supplier);
        formData.append("agentCode", data.agentCode);
        formData.append("productCode", data.productCode);
        formData.append("salePrice", data.salePrice);
        formData.append("retailPrice", data.retailPrice);
        formData.append("wholesalePrice", data.wholesalePrice);
        formData.append("quantity", data.quantity);
        formData.append("link", data.link);
        formData.append("type", data.type);

        dispatch(addProductSuppliers(formData, currentUser?.accessToken));
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

  const listSupplier = useSelector(
    (state) => state.defaultReducer.listSupplier
  );
  useEffect(() => {
    dispatch(getSupplier());
  }, []);
  const handleCloseAdd = () => {
    setShowadd(false);
  };

  const dispatch = useDispatch();
  const listTypes = useSelector((state) => state.defaultReducer.listType);
  useEffect(() => {
    dispatch(getAllTypeProduct());
  }, []);

  useEffect(() => {
    dispatch(getProducts());
  }, []);

  useEffect(() => {
    dispatch(getProductSupplier());
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
                <p>Quản lý Sản Phẩm Cung Cấp</p>
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
                  <span>Thêm Sản Phẩm</span>
                </button>
              </div>
            </div>
          </div>
          <table className="table">
            <thead classNane="table-dark">
              <tr>
                {/* <th>STT</th> */}
                <th>Ảnh</th>
                <th>Tên Sản phẩm</th>
                <th>Số lượng Kho</th>
                <th>Giá Sale</th>
                <th>Giá Bán</th>
                <th>Giá Sỉ</th>
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
                  {listProductSupplier?.map((item, index) => (
                    <tr>
                      {/* <td>{index}</td> */}
                      <td>
                        <img src={item.image} alt={item.title} />
                      </td>
                      <td>{item.name}</td>

                      <td>{item.quantity}</td>
                      <td>
                        <p>{`${item.salePrice?.toLocaleString()}đ`}</p>
                      </td>
                      <td>
                        <p>{`${item.retailPrice?.toLocaleString()}đ`}</p>
                      </td>
                      <td>
                        <p>{`${item.wholesalePrice?.toLocaleString()}đ`}</p>
                      </td>
                      <td>
                        <Link to={`/list-products-supplier/${item._id}`}>
                          <button className="btn btn-success">
                            <i className="fa fa-edit"></i>
                          </button>
                        </Link>
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            dispatch(
                              deleteProductSupplier(
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

      <Modal show={showadd} onHide={handleCloseAdd} className="modal">
        <ModalHeader>
          <ModalTitle>Thêm sản phẩm</ModalTitle>
        </ModalHeader>
        <ModalBody className="modal-body">
          <Form.Group className="formgroup-body">
            <Form.Label>Tên sản phẩm: </Form.Label>
            <Form.Control
              type="text"
              onChange={handleChange("name")}
              placeholder="Nhập tên sản phẩm..."
            />
            <Form.Label>Mã sản phẩm: </Form.Label>
            <Form.Control
              type="text"
              onChange={handleChange("productCode")}
              placeholder="Nhập mã sản phẩm..."
            />
            <Form.Label>Mã đại lý: </Form.Label>
            <Form.Control
              type="text"
              onChange={handleChange("agentCode")}
              placeholder="Nhập mã đại lý..."
            />
            <Form.Label>Nhà Cung Cấp: </Form.Label>
            <Form.Select
              aria-label="Default select example"
              onChange={handleChange("supplier")}
            >
              <option>Chọn loại sản phẩm</option>
              {listSupplier?.map((item, index) => (
                <option value={item?.name}>{item.name}</option>
              ))}
            </Form.Select>
            <Form.Label>
              Chọn Link tương ứng với nhà cung cấp sản phẩm:
            </Form.Label>
            <Form.Select
              aria-label="Default select example"
              onChange={handleChange("link")}
            >
              <option>Chọn link sản phẩm</option>
              {listSupplier?.map((item, index) => (
                <option value={item?.link}>{item.link}</option>
              ))}
            </Form.Select>
            <Form.Label>Loại Sản Phẩm: </Form.Label>
            <Form.Select
              aria-label="Default select example"
              onChange={handleChange("type")}
            >
              <option>Chọn loại sản phẩm</option>
              {listTypes?.map((item, index) => (
                <option value={item?.name}>{item.name}</option>
              ))}
            </Form.Select>
            {/* <Form.Label>Mô tả sản phẩm: </Form.Label>
            <textarea
              className="form-control"
              type="text"
              onChange={handleChange("description")}
            /> */}
            <Form.Label>Giá sale: </Form.Label>
            <Form.Control
              type="number"
              onChange={handleChange("salePrice")}
              placeholder="Nhập giá sale sản phẩm..."
            />
            <Form.Label>Giá bán: </Form.Label>
            <Form.Control
              type="number"
              onChange={handleChange("retailPrice")}
              placeholder="Nhập giá bán sản phẩm..."
            />
            <Form.Label>Giá sỉ: </Form.Label>
            <Form.Control
              type="number"
              onChange={handleChange("wholesalePrice")}
              placeholder="Nhập giá sỉ sản phẩm..."
            />
            <Form.Label>Số lượng sản phẩm: </Form.Label>
            <Form.Control
              type="number"
              onChange={handleChange("quantity")}
              placeholder="Nhập số lượng sản phẩm..."
            />
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

export default ListProductSupplier;
