import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./style.css";
import { getAllTypeProductCombo } from "../../../redux/actions/typecombo.action";

const EditComboPage = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const handleToggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };
  const [data, setData] = useState({
    image: "",
    quantity: "",
    title: "",
    type: "",
    link: "",
    newPrice: "",
    status: "",
    products: [],
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    productCode: "",
    image: "",
    price: "",
    oldPrice: "",
    status: "",
    quantity: "",
  });
  const [newProductError, setNewProductError] = useState("");

  const listTypeComBos = useSelector(
    (state) => state.defaultReducer.listTypeComBo
  );
  useEffect(() => {
    dispatch(getAllTypeProductCombo());
  }, []);

  useEffect(() => {
    fetch(`https://phutungxemay.onrender.com/v1/combo/${path}`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...data.products];
    updatedProducts[index][field] = value;
    setData({ ...data, products: updatedProducts });
  };

  const handleDataChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  const handleNewProductChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProduct = () => {
    if (
      !newProduct.name ||
      !newProduct.productCode ||
      !newProduct.price ||
      !newProduct.oldPrice ||
      !newProduct.status ||
      !newProduct.quantity
    ) {
      setNewProductError("Vui lòng điền đầy đủ thông tin sản phẩm");
      return;
    }

    const existingProduct = data.products.find(
      (product) => product.productCode === newProduct.productCode
    );
    if (existingProduct) {
      setNewProductError("Sản phẩm đã tồn tại trong danh sách");
      return;
    }

    setData({ ...data, products: [...data.products, newProduct] });

    setNewProduct({
      name: "",
      productCode: "",
      image: "",
      price: "",
      oldPrice: "",
      status: "",
      quantity: "",
    });

    setNewProductError("");
  };

  const handleAddProductToCombo = () => {
    const url = `https://phutungxemay.onrender.com/v1/combo/addcombo/${path}`;

    axios
      .post(url, {
        additionalProducts: [newProduct],
      })
      .then((response) => {
        toast.success("Thêm sản phẩm vào combo thành công");
        navigate("/list-products-combos-admin");
      })
      .catch((error) => {
        toast.error("Thêm sản phẩm vào combo thất bại");
      });
  };

  const handleDeleteProduct = (index) => {
    const updatedProducts = [...data.products];
    updatedProducts.splice(index, 1);
    setData({ ...data, products: updatedProducts });
  };

  const handleSaveChanges = () => {
    const url = `https://phutungxemay.onrender.com/v1/combo//combos/${path}`;

    axios
      .put(url, data)
      .then((response) => {
        toast.success("Lưu thay đổi thành công");
        navigate("/list-products-combos-admin");
      })
      .catch((error) => {
        toast.error("Lưu thay đổi thất bại");
      });
  };

  return (
    <div className="edit-combo-page">
      <ToastContainer />
      <div className="edit-combo-header">
        <h1>Chỉnh Sửa Sản Phẩm ComBo</h1>
        <button onClick={handleSaveChanges}>Lưu thay đổi</button>
        <Link to="/list-products-combos-admin">
          <button>Thoát</button>
        </Link>
      </div>
      <div className="edit-combo-content">
        <div className="row">
          <div className="col-6">
            <h3>Sửa Combo</h3>
            <div className="combo-info" style={{ marginTop: "2rem" }}>
              <div className="mb-3">
                <div className="mb-3">
                  <span>Hình ảnh Sản Phẩm ComBo</span>
                  <img
                    style={{ width: "100px" }}
                    src={data.image}
                    alt={data.title}
                  />
                </div>
                <span>Link Hình ảnh Sản Phẩm ComBo</span>
                <input
                  className="form-control"
                  type="text"
                  name="title"
                  value={data.image}
                  onChange={(e) => handleDataChange("image", e.target.value)}
                />
              </div>
              <div className="mb-3">
                <span>Số lượng</span>
                <input
                  className="form-control"
                  type="number"
                  value={data.quantity}
                  onChange={(e) => handleDataChange("quantity", e.target.value)}
                />
              </div>
              <div className="mb-3">
                <span>Tên combo</span>
                <input
                  className="form-control"
                  type="text"
                  value={data.title}
                  onChange={(e) => handleDataChange("title", e.target.value)}
                />
              </div>
              <div className="mb-3">
                <span>Loại combo</span>
                <select
                  style={{
                    width: "100%",
                    margin: "0.5rem 0",
                    border: "1px solid #ced4da",
                    outline: "none",
                    padding: "0.4rem",
                  }}
                  value={data.type}
                  onChange={(e) => handleDataChange("type", e.target.value)}
                >
                  {listTypeComBos &&
                    listTypeComBos.map((item, index) => (
                      <option key={index} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mb-3">
                <span>Link tương ứng với loại combo</span>
                <br />
                <select
                  style={{
                    width: "100%",
                    margin: "0.5rem 0",
                    border: "1px solid #ced4da",
                    outline: "none",
                    padding: "0.4rem",
                  }}
                  value={data.link}
                  onChange={(e) => handleDataChange("link", e.target.value)}
                >
                  {listTypeComBos &&
                    listTypeComBos.map((item, index) => (
                      <option key={index} value={item.link}>
                        {item.link}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mb-3">
                <span>Trạng thái</span>
                <select
                  style={{
                    width: "100%",
                    margin: "0.5rem 0",
                    border: "1px solid #ced4da",
                    outline: "none",
                    padding: "0.4rem",
                  }}
                  value={data.status}
                  onChange={(e) => handleDataChange("status", e.target.value)}
                >
                  <option value="Còn Hàng">Còn Hàng</option>
                  <option value="Hết Hàng">Hết Hàng</option>
                </select>
              </div>
              {/* <div className="mb-3">
                <span>Giá Mới</span>
                <input
                  className="form-control"
                  type="number"
                  value={data.newPrice}
                  onChange={(e) => handleDataChange("newPrice", e.target.value)}
                />
              </div> */}
            </div>
          </div>
          <div className="col-6">
            <div className="add-product-combo">
              <h3>Thêm sản phẩm vào combo</h3>
              <div className="mb-3">
                <div className="mb-3">
                  <span>Hình ảnh Sản Phẩm</span>
                  <img
                    style={{ width: "100px" }}
                    src={newProduct.image}
                    alt={data.name}
                  />
                </div>
                <span>Link Hình ảnh Sản Phẩm</span>
                <input
                  className="form-control"
                  type="text"
                  name="image"
                  value={newProduct.image}
                  onChange={handleNewProductChange}
                />
              </div>
              <div className="mb-3">
                <span>Tên Sản Phẩm</span>
                <input
                  className="form-control"
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleNewProductChange}
                />
              </div>
              <div className="mb-3">
                <span>Mã sản phẩm</span>
                <input
                  className="form-control"
                  type="text"
                  name="productCode"
                  value={newProduct.productCode}
                  onChange={handleNewProductChange}
                />
              </div>
              <div className="mb-3">
                <span>Giá Mới</span>
                <input
                  className="form-control"
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleNewProductChange}
                />
              </div>
              <div className="mb-3">
                <span>Giá cũ</span>
                <input
                  className="form-control"
                  type="number"
                  name="oldPrice"
                  value={newProduct.oldPrice}
                  onChange={handleNewProductChange}
                />
              </div>
              <div className="mb-3">
                <span>Số lượng sản phẩm</span>
                <select
                  style={{
                    width: "100%",
                    margin: "0.5rem 0",
                    border: "1px solid #ced4da",
                    outline: "none",
                    padding: "0.4rem",
                  }}
                  name="status"
                  value={newProduct.status}
                  onChange={handleNewProductChange}
                >
                  <option value="Còn Hàng">Còn Hàng</option>
                  <option value="Hết Hàng">Hết Hàng</option>
                </select>
              </div>
              <div className="mb-3">
                <span>Số lượng</span>
                <input
                  className="form-control"
                  type="number"
                  name="quantity"
                  value={newProduct.quantity}
                  onChange={handleNewProductChange}
                />
              </div>
              {newProductError && (
                <p className="error-message">{newProductError}</p>
              )}
              <button
                style={{ background: "blue", margin: "1rem 0" }}
                onClick={handleAddProductToCombo}
              >
                Thêm vào combo
              </button>
            </div>
          </div>

          <div className="col-12">
            <div className="product-list">
              <h2>Danh sách sản phẩm Trong ComBo</h2>
              <div className="product-table">
                <table>
                  <thead>
                    <tr>
                      <th>Tên sản phẩm</th>
                      <th>Mã sản phẩm</th>
                      <th>Hình ảnh</th>
                      <th>Giá</th>
                      <th>Giá cũ</th>
                      <th>Trạng thái</th>
                      <th>Số lượng</th>
                      {/* <th></th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {data.products &&
                      data.products.map((product, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              className="form-control"
                              type="text"
                              value={product.name}
                              onChange={(e) =>
                                handleProductChange(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="text"
                              value={product.productCode}
                              onChange={(e) =>
                                handleProductChange(
                                  index,
                                  "productCode",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <img
                              style={{ width: "50px", padding: "0.6rem" }}
                              src={product.image}
                              alt={data.name}
                            />
                            <input
                              className="form-control"
                              type="text"
                              value={product.image}
                              onChange={(e) =>
                                handleProductChange(
                                  index,
                                  "image",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="number"
                              value={product.price}
                              onChange={(e) =>
                                handleProductChange(
                                  index,
                                  "price",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="number"
                              value={product.oldPrice}
                              onChange={(e) =>
                                handleProductChange(
                                  index,
                                  "oldPrice",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <select
                              style={{
                                width: "100%",
                                margin: "0.5rem 0",
                                border: "1px solid #ced4da",
                                outline: "none",
                                padding: "0.4rem",
                              }}
                              value={product.status}
                              onChange={(e) =>
                                handleProductChange(
                                  index,
                                  "status",
                                  e.target.value
                                )
                              }
                            >
                              <option value="Còn Hàng">Còn Hàng</option>
                              <option value="Hết Hàng">Hết Hàng</option>
                            </select>
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="number"
                              value={product.quantity}
                              onChange={(e) =>
                                handleProductChange(
                                  index,
                                  "quantity",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          {/* <td>
                            <button
                              style={{ background: "red", margin: "1rem 0" }}
                              onClick={() => handleDeleteProduct(index)}
                            >
                              Xóa
                            </button>
                          </td> */}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* <div className="col-6">
            <div className="add-product">
              <h3>Thêm sản phẩm</h3>
              {showAddForm && (
                <>
                  <div className="input-group">
                    <label>Tên sản phẩm</label>
                    <input
                      type="text"
                      name="name"
                      value={newProduct.name}
                      onChange={handleNewProductChange}
                    />
                  </div>
                  <div className="input-group">
                    <label>Mã sản phẩm</label>
                    <input
                      type="text"
                      name="productCode"
                      value={newProduct.productCode}
                      onChange={handleNewProductChange}
                    />
                  </div>
                  <div className="input-group">
                    <label>Hình ảnh</label>
                    <input
                      type="text"
                      name="image"
                      value={newProduct.image}
                      onChange={handleNewProductChange}
                    />
                  </div>
                  <div className="input-group">
                    <label>Giá</label>
                    <input
                      type="number"
                      name="price"
                      value={newProduct.price}
                      onChange={handleNewProductChange}
                    />
                  </div>
                  <div className="input-group">
                    <label>Giá cũ</label>
                    <input
                      type="number"
                      name="oldPrice"
                      value={newProduct.oldPrice}
                      onChange={handleNewProductChange}
                    />
                  </div>
                  <div className="input-group">
                    <label>Trạng thái</label>
                    <select
                      name="status"
                      value={newProduct.status}
                      onChange={handleNewProductChange}
                    >
                      <option value="Còn Hàng">Còn Hàng</option>
                      <option value="Hết Hàng">Hết Hàng</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Số lượng</label>
                    <input
                      type="number"
                      name="quantity"
                      value={newProduct.quantity}
                      onChange={handleNewProductChange}
                    />
                  </div>
                  <button onClick={handleAddProduct}>Thêm</button>
                  <button onClick={handleToggleAddForm}>Đóng</button>
                </>
              )}
              {newProductError && (
                <p className="error-message">{newProductError}</p>
              )}
              {!showAddForm && (
                <button onClick={handleToggleAddForm}>Thêm</button>
              )}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default EditComboPage;
