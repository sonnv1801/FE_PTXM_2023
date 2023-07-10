import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { getAllTypeProductCombo } from "../../../redux/actions/typecombo.action";
import axios from "axios";
import Menu from "../menu/Menu";

function ListProductComboAdmin() {
  const [showadd, setShowadd] = useState(false);
  const isLoading = useSelector((state) => state.defaultReducer.isLoading);
  const [expandedComboIds, setExpandedComboIds] = useState([]);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
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
    link: "",
    title: "",
    type: "",
    status: "",
    quantity: Number,
    products: [
      {
        image: "",
        name: "",
        productCode: "",
        price: Number,
        oldPrice: Number,
        status: "",
        quantity: Number,
        remainingQuantity: Number,
      },
    ],
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const handleInputChange = (image) => (e) => {
    if (image === "image") {
      const file = e.target.files[0];
      setFormData((prevData) => ({ ...prevData, [image]: file }));
    } else {
      const value = e.target.value;
      setFormData((prevData) => ({ ...prevData, [image]: value }));
    }
  };

  const handleProductChange = (index, field) => (e) => {
    if (field === "images") {
      const file = e.target.files[0];
      handleImageUpload(index, file);
    } else {
      const value =
        field === "price" ? parseFloat(e.target.value) : e.target.value;
      const updatedProducts = [...formData.products];
      updatedProducts[index][field] = value;
      setFormData((prevData) => ({ ...prevData, products: updatedProducts }));

      const newPrice = updatedProducts.reduce(
        (sum, product) => sum + (parseFloat(product.price) || 0),
        0
      );
      setFormData((prevData) => ({ ...prevData, newPrice: newPrice }));
    }
  };

  const handleImageUpload = (index, file) => {
    if (file) {
      const updatedProducts = [...formData.products];
      const reader = new FileReader();
      reader.onloadend = () => {
        updatedProducts[index].images = reader.result;
        setFormData((prevData) => ({
          ...prevData,
          products: updatedProducts,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    setFormData((prevData) => ({
      ...prevData,
      products: [
        ...prevData.products,
        {
          images: null,
          name: null,
          productCode: null,
          price: Number,
          oldPrice: Number,
          status: null,
          quantity: Number,
          remainingQuantity: Number,
        },
      ],
    }));
    fetchCombos();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { image, products, title, type, status, quantity, link } = formData;

    if (!image || !title || !type || !status || !quantity || !link) {
      toast.warn("Vui lòng nhập đầy đủ thông tin combo.");
      return;
    }

    if (products.length === 0) {
      toast.warn("Vui lòng nhập ít nhất 1 sản phẩm trong combo.");
      return;
    }

    const hasEmptyProduct = products.some(
      (product) =>
        !product.images ||
        !product.name ||
        !product.productCode ||
        !product.price ||
        !product.oldPrice ||
        !product.status ||
        !product.quantity ||
        !product.remainingQuantity
    );

    if (hasEmptyProduct) {
      toast.warn(
        "Vui lòng nhập đầy đủ thông tin cho các sản phẩm trong combo."
      );
      return;
    }

    setIsCreatingProduct(true); // Bắt đầu quá trình tạo sản phẩm

    const comboFormData = new FormData();
    comboFormData.append("image", image);
    comboFormData.append("link", link);
    comboFormData.append("title", title);
    comboFormData.append("type", type);
    comboFormData.append("status", status);
    comboFormData.append("quantity", quantity);

    products?.forEach((product, index) => {
      comboFormData.append(`products[${index}][name]`, product.name);
      comboFormData.append(
        `products[${index}][productCode]`,
        product.productCode
      );
      comboFormData.append(`products[${index}][price]`, product.price);
      comboFormData.append(`products[${index}][oldPrice]`, product.oldPrice);
      comboFormData.append(`products[${index}][status]`, product.status);
      comboFormData.append(`products[${index}][quantity]`, product.quantity);
      comboFormData.append(
        `products[${index}][remainingQuantity]`,
        product.remainingQuantity
      );
      const productImage = product.images;
      comboFormData.append(`products[${index}][images]`, productImage);
    });

    try {
      const comboResponse = await axios.post(
        "https://phutungxemay.onrender.com/v1/combo/create",
        comboFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Thêm mới combo thành công.");
      setShowadd(false);
      setFormData({
        image: "",
        title: "",
        type: "",
        status: "",
        quantity: "",
        products: [
          {
            images: "",
            name: "",
            productCode: "",
            price: Number,
            oldPrice: Number,
            status: "",
            quantity: Number,
            remainingQuantity: Number,
          },
        ],
      });
      setSelectedImage(null);
      fetchCombos();
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsCreatingProduct(false); // Kết thúc quá trình tạo sản phẩm
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
      await axios.delete(
        `https://phutungxemay.onrender.com/v1/combo/${comboId}`
      );

      fetchCombos();

      toast.success("Xóa Thành Công Combo");
    } catch (error) {
      console.error("Error deleting combo:", error);
      toast.error("Xóa Thất Bại Combo");
    }
  };

  useEffect(() => {
    const selectedSupplier = listTypeComBos.find(
      (supplier) =>
        supplier.name.trim().toLowerCase() ===
        formData.type.trim().toLowerCase()
    );
    if (selectedSupplier) {
      setFormData((prevData) => ({
        ...prevData,
        link: selectedSupplier._id,
      }));
    }
  }, [formData.type, listTypeComBos]);
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
                                        src={product.images}
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
          <ModalTitle>Thêm Combo sản phẩm</ModalTitle>
        </ModalHeader>
        <ModalBody className="modal-body">
          <Form.Group className="formgroup-body">
            <Form.Label htmlFor="image">Tên Combo: </Form.Label>
            <Form.Control
              type="text"
              id="title"
              name="title"
              placeholder="Nhập tên combo..."
              value={formData.title}
              onChange={handleInputChange("title")}
            />

            <Form.Label htmlFor="type">Loại sản phẩm: </Form.Label>
            <Form.Select
              id="type"
              name="type"
              aria-label="Default select example"
              value={formData.type}
              onChange={handleInputChange("type")}
            >
              <option>Chọn loại sản phẩm</option>
              {listTypeComBos?.map((item, index) => (
                <option value={item?.name}>{item.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Label htmlFor="image">Hình ảnh: </Form.Label>
          <Form.Control
            type="file"
            size="sm"
            placeholder="Hình ảnh combo Sản Phẩm..."
            accept="image/*"
            name="image"
            onChange={handleInputChange("image")}
          />
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Selected"
              style={{ width: "40%", padding: "1rem", margin: "0 auto" }}
            />
          )}
          <Form.Label htmlFor="quantity">Số lượng Combo: </Form.Label>
          <Form.Control
            type="number"
            id="quantity"
            name="quantity"
            placeholder="Nhập Số lượng Combo..."
            value={formData.quantity}
            onChange={handleInputChange("quantity")}
          />

          <Form.Label htmlFor="status">Trạng thái:</Form.Label>
          <Form.Select
            id="type"
            aria-label="Default select example"
            name="status"
            value={formData.status}
            onChange={handleInputChange("status")}
          >
            <option value="">Chọn trạng thái</option>
            <option value="Còn Hàng">Còn Hàng</option>
            <option value="Hết Hàng">Hết Hàng</option>
          </Form.Select>
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
                    Tên Sản Phẩm:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên sản phẩm..."
                    id={`name-${index}`}
                    // value={product.name}
                    onChange={handleProductChange(index, "name")}
                  />
                  <Form.Label htmlFor={`image-${index}`}>Hình Ảnh:</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    name="images"
                    onChange={handleProductChange(index, "images")}
                  />
                </div>
                <div className="col-6">
                  <Form.Label htmlFor={`productCode-${index}`}>
                    Mã sản phẩm:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập mã sản phẩm..."
                    id={`productCode-${index}`}
                    value={product.productCode}
                    onChange={handleProductChange(index, "productCode")}
                  />
                </div>
                <div className="col-6">
                  <Form.Label htmlFor={`price-${index}`}>
                    Giá mới sản phẩm:
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Nhập giá mới sản phẩm..."
                    id={`price-${index}`}
                    value={product.price}
                    onChange={handleProductChange(index, "price")}
                  />
                </div>
                <div className="col-6">
                  <Form.Label htmlFor={`oldPrice-${index}`}>
                    Giá cũ sản phẩm:
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Nhập giá cũ sản phẩm..."
                    id={`oldPrice-${index}`}
                    value={product.oldPrice}
                    onChange={handleProductChange(index, "oldPrice")}
                  />
                </div>
                <div className="col-6">
                  <Form.Label htmlFor={`status-${index}`}>
                    Trạng Thái sản phẩm:
                  </Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    id={`status-${index}`}
                    value={product.status}
                    onChange={handleProductChange(index, "status")}
                  >
                    <option value="">Chọn trạng thái</option>
                    <option value="Còn Hàng">Còn Hàng</option>
                    <option value="Hết Hàng">Hết Hàng</option>
                  </Form.Select>
                </div>
                <div className="col-6">
                  <Form.Label htmlFor={`quantity-${index}`}>
                    Số lượng:
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Nhập số lượng sản phẩm..."
                    id={`quantity-${index}`}
                    value={product.quantity}
                    onChange={handleProductChange(index, "quantity")}
                  />
                </div>
                <div className="col-6">
                  <Form.Label htmlFor={`remainingQuantity-${index}`}>
                    Tồn Kho:
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Nhập số lượng tồn kho sản phẩm..."
                    id={`remainingQuantity-${index}`}
                    value={product.remainingQuantity}
                    onChange={handleProductChange(index, "remainingQuantity")}
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
            disabled={isCreatingProduct}
            variant="success"
            style={{ background: "#198754" }}
            onClick={handleSubmit}
            encType="multipart/form-data"
          >
            {isCreatingProduct ? "Vui lòng chờ..." : "Tạo sản phẩm"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ListProductComboAdmin;
