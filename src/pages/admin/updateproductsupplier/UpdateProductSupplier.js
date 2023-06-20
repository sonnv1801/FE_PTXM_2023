import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import { getSupplier } from "../../../redux/actions/supplier.action";
import { updateProductSupplier } from "../../../redux/actions/productSupplier.action";
const UpdateProductSupplier = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState("");
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
  });
  const [loading, setLoading] = useState(false); // State cho nút xoay đợi
  console.log(data, "data");
  console.log(loading, "loading");
  useEffect(() => {
    fetch(`https://phutungxemay.onrender.com/v1/productsupplier/${path}`)
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
  const listSupplier = useSelector(
    (state) => state.defaultReducer.listSupplier
  );
  useEffect(() => {
    dispatch(getSupplier());
  }, []);

  const handleSubmit = async () => {
    try {
      let emptyFields = 0; // Biến đếm số lượng trường bị trống

      // Kiểm tra từng trường và tăng biến đếm nếu trường đó trống
      if (data.name === "") emptyFields++;
      // if (data.image === "") emptyFields++;
      if (data.supplier === "") emptyFields++;
      if (data.agentCode === "") emptyFields++;
      if (data.productCode === "") emptyFields++;
      if (data.salePrice === "") emptyFields++;
      if (data.retailPrice === "") emptyFields++;
      if (data.wholesalePrice === "") emptyFields++;
      if (data.quantity === "") emptyFields++;
      if (data.link === "") emptyFields++;

      if (emptyFields > 0) {
        toast.warn("Nhập đầy đủ", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        setLoading(true); // Hiển thị nút xoay đợi

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
        dispatch(updateProductSupplier(path, formData, navigate));
      }
      setLoading(false); // Ẩn nút xoay đợi
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
            <span>Mã Đại Lý</span>
            <input
              className="form-control"
              type="text"
              name="agentCode"
              value={data.agentCode}
              onChange={handleChange("agentCode")}
            />
          </div>
          <div className="mb-3">
            <span>Nhà Cung Cấp</span>
            <select onChange={handleChange("supplier")}>
              <option value={data.supplier}>{data.supplier}</option>
              {listSupplier?.map((item, index) => (
                <option value={item?.name}>{item?.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <span>Link Cung Cấp</span>
            <select onChange={handleChange("link")}>
              <option value={data.link}>{data.link}</option>
              {listSupplier?.map((item, index) => (
                <option value={item?.link}>{item?.link}</option>
              ))}
            </select>
          </div>
          <div className="mb-3" style={{ width: "200px" }}>
            {/* Display the current image */}
            {previewImage && (
              <img src={previewImage} alt="Preview" style={{ width: "100%" }} />
            )}
          </div>
        </div>

        <div className="col-6">
          {/* <div className="mb-3">
              <span>Mô tả Sản Phẩm</span>
              <textarea
                className="form-control"
                type="text"
                name="description"
                value={data.description}
                onChange={handleChange("description")}
              />
            </div> */}
          <div className="mb-3">
            <span>Giá Sale</span>
            <input
              className="form-control"
              type="number"
              name="salePrice"
              value={data.salePrice}
              onChange={handleChange("salePrice")}
            />
          </div>
          <div className="mb-3">
            <span>Giá Bán</span>
            <input
              className="form-control"
              type="number"
              name="retailPrice"
              value={data.retailPrice}
              onChange={handleChange("retailPrice")}
            />
          </div>
          <div className="mb-3">
            <span>Giá sỉ</span>
            <input
              className="form-control"
              type="number"
              name="wholesalePrice"
              value={data.wholesalePrice}
              onChange={handleChange("wholesalePrice")}
            />
          </div>
          <div className="mb-3">
            <span>Số lượng</span>
            <input
              className="form-control"
              type="number"
              name="quantity"
              value={data.quantity}
              onChange={handleChange("quantity")}
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

          {/* <div className="mb-3">
              <span>Số lượng sản phẩm</span>
              <select onChange={handleChange("quantity")}>
                <option value={data.quantity}>{data.quantity}</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </div> */}

          <div className="text">
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Đợi Tý" : "Update"}
            </button>
            <Link to={"/prducts-supplier"}>
              <button className="btn btn-success">Thoát!</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProductSupplier;
