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
import { getAllTypeProductCombo } from "../../../redux/actions/typecombo.action";
import axios from "axios";
import Menu from "../menu/Menu";
function ListProductComboAdmin() {
  const [showadd, setShowadd] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("token"));
  const isLoading = useSelector((state) => state.defaultReducer.isLoading);
  const [expandedComboIds, setExpandedComboIds] = useState([]);

  const handleCloseAdd = () => {
    setShowadd(false);
  };

  const dispatch = useDispatch();

  const listTypeComBos = useSelector(
    (state) => state.defaultReducer.listTypeComBo
  );
  useEffect(() => {
    dispatch(getAllTypeProductCombo());
  }, []);

  const [formData, setFormData] = useState({
    image: "",
    title: "",
    type: "",
    link: "",
    status: "",
    quantity: "",
    products: [{}],
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products];
    const updatedProduct = { ...updatedProducts[index] };
    updatedProduct[field] = value === "" ? "" : value;
    updatedProducts[index] = updatedProduct;
    setFormData({ ...formData, products: updatedProducts });
  };

  const handleAddProduct = () => {
    setFormData({
      ...formData,
      products: [
        ...formData.products,
        {
          image: "",
          name: "",
          productCode: "",
          price: 0,
          oldPrice: 0,
          status: "",
          quantity: 0,
          remainingQuantity: 0,
        },
      ],
    });
    fetchCombos();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.products.length === 0) {
      toast.warn("Vui lòng nhập ít nhất 1 sản phẩm trong combo.");
      return;
    }
    if (
      formData.image !== "" &&
      formData.title !== "" &&
      formData.link !== "" &&
      formData.status !== "" &&
      formData.quantity !== "" &&
      formData.title !== ""
    ) {
      try {
        const response = await axios.post(
          "https://phutungxemay.onrender.com/v1/combo/",
          formData
        );
        console.log(response.data); // Combo được tạo thành công
        // Thực hiện các hành động khác sau khi tạo combo thành công
        fetchCombos();
        // Reset form
        setFormData({
          image: "",
          title: "",
          type: "",
          link: "",
          quantity: "",
          status: "",
          products: [],
        });
        toast.success("Thêm thành công sản phẩm");
        handleCloseAdd();
      } catch (error) {
        console.error(error);
      }
    } else {
      toast.warn("Nhập đầy đủ thông tin sản phẩm");
    }
  };

  const [combos, setCombos] = useState([]);

  useEffect(() => {
    fetchCombos();
  }, []);

  const fetchCombos = async () => {
    try {
      const response = await axios.get(
        "https://phutungxemay.onrender.com/v1/combo"
      );
      setCombos(response.data);
    } catch (error) {
      console.error("Error fetching combos:", error);
    }
  };

  const handleDeleteCombo = async (comboId) => {
    try {
      // Send a DELETE request to the API to delete the combo
      await axios.delete(
        `https://phutungxemay.onrender.com/v1/combo/${comboId}`
      );

      // Fetch the updated list of combos after deletion
      fetchCombos();

      // Show a success notification to the user
      toast.success("Xóa Thành Công Combo");
    } catch (error) {
      console.error("Error deleting combo:", error);
      // Show an error notification to the user
      toast.error("Xóa Thất Bại Combo");
    }
  };
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
                <p>Quản lý ComBo</p>
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
                  <span>Thêm Combo</span>
                </button>
              </div>
            </div>
          </div>
          <table className="table">
            <thead classNane="table-dark">
              <tr>
                <th>Ảnh</th>
                <th>Tên Sản phẩm</th>
                <th>Mặt hàng</th>
                <th>Giá</th>
                <th>Số lượng Combo</th>
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
                  {combos?.map((combo, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        {/* Render other combo data */}

                        <td>
                          <img
                            src={combo.image}
                            alt={combo.title}
                            style={{ width: "100%", padding: "1rem" }}
                          />
                        </td>
                        <td>{combo.title}</td>
                        <td>{combo.type}</td>
                        <td>
                          <p>{`${combo.newPrice?.toLocaleString()}đ`}</p>
                        </td>
                        <td>{combo.quantity}</td>
                        <td>
                          <Link to={`/edit-combos/${combo._id}`}>
                            <button className="btn btn-success">
                              <i className="fa fa-edit"></i>
                            </button>
                          </Link>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteCombo(combo._id)}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                          {/* Check if the combo is expanded */}
                          {expandedComboIds.includes(combo._id) ? (
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                // Remove the combo ID from the expanded list
                                setExpandedComboIds(
                                  expandedComboIds.filter(
                                    (id) => id !== combo._id
                                  )
                                );
                              }}
                            >
                              Ẩn
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                // Add the combo ID to the expanded list
                                setExpandedComboIds([
                                  ...expandedComboIds,
                                  combo._id,
                                ]);
                              }}
                            >
                              Xem thêm
                            </button>
                          )}
                        </td>
                      </tr>
                      {/* Render products if the combo is expanded */}
                      {expandedComboIds.includes(combo._id) && (
                        <tr>
                          <td colSpan="6">
                            <h4>
                              Danh sách sản phẩm: <b>{combo.title}</b>
                            </h4>
                            <ul>
                              <div id="prducts-combos-title">
                                <div className="row">
                                  <div className="col-2">Hình Ảnh</div>
                                  <div className="col-2">Tên sản phẩm</div>
                                  <div className="col-2">Mã sản phẩm</div>
                                  <div className="col-2">Giá mới</div>
                                  <div className="col-2">Giá cũ</div>
                                  <div className="col-2">
                                    Số lượng trong kho
                                  </div>
                                </div>
                              </div>
                              {combo.products.map((product, productIndex) => (
                                <div id="prducts-combos">
                                  <div className="row">
                                    <div className="col-2">
                                      <img
                                        style={{
                                          width: "100%",
                                          padding: "1rem",
                                        }}
                                        src={product.image}
                                        alt={product.name}
                                      />
                                    </div>
                                    <div className="col-2">{product.name}</div>
                                    <div className="col-2">
                                      {product.productCode}
                                    </div>
                                    <div className="col-2">{`${product.price?.toLocaleString()}đ`}</div>
                                    <div className="col-2">
                                      {`${product.oldPrice?.toLocaleString()}đ`}
                                    </div>
                                    <div className="col-2">
                                      {product.quantity}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
            <Form.Label htmlFor="image">Tên Combo: </Form.Label>
            <Form.Control
              type="text"
              id="title"
              name="title"
              placeholder="Nhập tên combo..."
              // value={formData.title}
              onChange={handleInputChange}
            />

            <Form.Label htmlFor="type">Loại sản phẩm: </Form.Label>
            <Form.Select
              id="type"
              name="type"
              aria-label="Default select example"
              // value={formData.type}
              onChange={handleInputChange}
            >
              <option>Chọn loại sản phẩm</option>
              {listTypeComBos?.map((item, index) => (
                <option value={item?.name}>{item.name}</option>
              ))}
            </Form.Select>
            <Form.Label htmlFor="link">Link sản phẩm: </Form.Label>
            <Form.Select
              aria-label="Default select example"
              // value={formData.link}
              id="link"
              name="link"
              onChange={handleInputChange}
            >
              <option>Chọn Link</option>
              {listTypeComBos?.map((item, index) => (
                <option value={item?.link}>{item.link}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Label htmlFor="image">Hình ảnh: </Form.Label>
          <Form.Control
            type="text"
            size="sm"
            accept="image/*"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
          />
          <Form.Label htmlFor="quantity">Số lượng Combo: </Form.Label>
          <Form.Control
            type="text"
            id="quantity"
            name="quantity"
            placeholder="Nhập trạng thái..."
            // value={formData.quantity}
            onChange={handleInputChange}
          />
          <Form.Label htmlFor="status">Trạng thái: </Form.Label>
          <Form.Control
            type="text"
            id="status"
            name="status"
            placeholder="Nhập trạng thái..."
            // value={formData.status}
            onChange={handleInputChange}
          />
        </ModalBody>
        <ModalHeader>
          <ModalTitle>Thêm sản phẩm</ModalTitle>
        </ModalHeader>
        {formData.products.map((product, index) => (
          <ModalBody className="modal-body" key={index}>
            <Form.Group className="formgroup-body">
              <Form.Label>Sản phẩm: {index + 1} </Form.Label> <br />
              <div className="row">
                <div className="col-6">
                  <Form.Label htmlFor={`name-${index}`}>
                    Tên Sản Phẩm:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên sản phẩm..."
                    id={`name-${index}`}
                    // value={product.name}
                    onChange={(e) =>
                      handleProductChange(index, "name", e.target.value)
                    }
                  />
                  <Form.Label htmlFor={`image-${index}`}>Hình Ảnh</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập link hình ảnh sản phẩm..."
                    id={`image-${index}`}
                    // value={product.name}
                    onChange={(e) =>
                      handleProductChange(index, "image", e.target.value)
                    }
                  />
                </div>
                <div className="col-6">
                  <Form.Label htmlFor={`productCode-${index}`}>
                    Mã sản phẩm:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập mã sản phẩm..."
                    id={`productCode-${index}`}
                    // value={product.productCode}
                    onChange={(e) =>
                      handleProductChange(index, "productCode", e.target.value)
                    }
                  />
                </div>
                <div className="col-6">
                  <Form.Label htmlFor={`price-${index}`}>
                    Giá mới sản phẩm:{" "}
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Nhập giá mới sản phẩm..."
                    id={`price-${index}`}
                    // value={product.price}
                    onChange={(e) =>
                      handleProductChange(
                        index,
                        "price",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="col-6">
                  <Form.Label htmlFor={`oldPrice-${index}`}>
                    Giá cũ sản phẩm:{" "}
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Nhập giá cũ sản phẩm..."
                    id={`oldPrice-${index}`}
                    // value={product.oldPrice}
                    onChange={(e) =>
                      handleProductChange(
                        index,
                        "oldPrice",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="col-6">
                  <Form.Label htmlFor={`status-${index}`}>
                    Trạng Thái sản phẩm:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập trạnh thái sản phẩm..."
                    id={`status-${index}`}
                    // value={product.status}
                    onChange={(e) =>
                      handleProductChange(index, "status", e.target.value)
                    }
                  />
                </div>
                <div className="col-6">
                  <Form.Label htmlFor={`quantity-${index}`}>
                    Số lượng:{" "}
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Nhập số lượng sản phẩm..."
                    id={`quantity-${index}`}
                    // value={product.quantity}
                    onChange={(e) =>
                      handleProductChange(
                        index,
                        "quantity",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="col-6">
                  <Form.Label htmlFor={`remainingQuantity-${index}`}>
                    Tồn Kho:{" "}
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Nhập số lượng tồn kho sản phẩm..."
                    id={`remainingQuantity-${index}`}
                    // value={product.remainingQuantity}
                    onChange={(e) =>
                      handleProductChange(
                        index,
                        "remainingQuantity",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="col-6"></div>
              </div>
            </Form.Group>
          </ModalBody>
        ))}
        <ModalFooter>
          <Button
            variant="primary"
            style={{ background: "#0d6efd" }}
            onClick={handleAddProduct}
          >
            Thêm Sản Phẩm
          </Button>
          <Button
            variant="success"
            style={{ background: "#198754" }}
            onClick={handleSubmit}
          >
            Tạo Sản Phẩm
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ListProductComboAdmin;
