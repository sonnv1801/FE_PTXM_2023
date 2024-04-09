import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { updateProduct } from "../../../redux/actions/product.action";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import { getAllTypeProduct } from "../../../redux/actions/type.action";
import { getSupplier } from "../../../redux/actions/supplier.action";
import { updateProductoOrder } from "../../../redux/actions/order.action";
const EditProduct = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const dispatch = useDispatch();
  const [previewImage, setPreviewImage] = useState("");
  const navigate = useNavigate();
  const [data, setData] = useState({
    productCode: "",
    name: "",
    // supplier: "",
    salePrice: "",
    retailPrice: "",
    // wholesalePrice: "",
    type: "",
    image: "",
    // link: "",
    // quantityOrdered: "",
    // quantityDelivered: "",
    // deliveryStatus: "",
    // productPrice: "",
    // totalPrice: "",
    // productProfit: "",
    // totalProfit: "",
    // quantityPurchased: "",
  });

  const listTypes = useSelector((state) => state.defaultReducer.listType);
  useEffect(() => {
    dispatch(getAllTypeProduct());
  }, []);

  const listSupplier = useSelector(
    (state) => state.defaultReducer.listSupplier
  );
  useEffect(() => {
    dispatch(getSupplier());
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/v1/order/orders/products/${path}`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  const handleChange = (name) => (e) => {
    if (name === "image") {
      const file = e.target.files[0];
      setData({ ...data, [name]: file });

      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      const value = e.target.value;
      setData({ ...data, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      if (
        data.productCode !== "" &&
        data.name !== "" &&
        data.retailPrice !== "" &&
        data.salePrice !== "" &&
        data.type !== "" &&
        data.image !== ""
      ) {
        let formData = new FormData();
        formData.append("productCode", data.productCode);
        formData.append("name", data.name);
        formData.append("retailPrice", data.retailPrice);
        formData.append("salePrice", data.salePrice);
        formData.append("type", data.type);
        formData.append("image", data.image);
        toast.info("Đang Được Xử Lý, Vui Lòng Đợi Tý...", {
          position: toast.POSITION.TOP_CENTER,
        });
        dispatch(updateProductoOrder(path, formData, navigate));
      } else {
        toast.success("Sửa sản phẩm thành công", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="form-add-product">
      <h2>Chỉnh sửa sản phẩm nè!</h2>
      <div className="row">
        <div className="col-6">
          <div className="mb-3">
            <span>Tên Sản Phẩm</span>
            <input
              className="form-control"
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange("name")}
            />
          </div>
          <div className="mb-3">
            <span>Mã Sản Phẩm</span>
            <input
              className="form-control"
              type="text"
              name="productCode"
              value={data.productCode}
              onChange={handleChange("productCode")}
            />
          </div>

          <div className="mb-3">
            <span>Loại Sản Phẩm</span>
            <select onChange={handleChange("type")}>
              <option value={data.type}>{data.type}</option>
              {listTypes?.map((item, index) => (
                <option value={item?.name}>{item?.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-3" style={{ width: "200px" }}>
            {/* Display the current image */}
            {previewImage && (
              <div style={{ textAlign: "center", marginTop: "4rem" }}>
                <p>Hình ảnh</p>
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ width: "100%" }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="col-6">
          <div className="mb-3">
            <span>Giá Bán</span>
            <input
              className="form-control"
              type="text"
              name="retailPrice"
              value={data.retailPrice}
              onChange={handleChange("retailPrice")}
            />
          </div>
          <div className="mb-3">
            <span>Giá Khuyến Mãi</span>
            <input
              className="form-control"
              type="text"
              name="salePrice"
              value={data.salePrice}
              onChange={handleChange("salePrice")}
            />
          </div>
          <div className="mb-3">
            <span>Hình Ảnh</span>
            <input
              className="form-control"
              type="file"
              accept="image/*"
              name="image"
              onChange={handleChange("image")}
            />
          </div>

          <div className="text">
            <button className="btn btn-primary" onClick={handleSubmit}>
              Update
            </button>
            <Link to={"/list-products-admin"}>
              <button className="btn btn-success">Thoát!</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
