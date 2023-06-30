import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { updateProduct } from "../../../redux/actions/product.action";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import { getAllTypeProduct } from "../../../redux/actions/type.action";
const EditProduct = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const dispatch = useDispatch();
  const [previewImage, setPreviewImage] = useState("");
  const navigate = useNavigate();
  const [data, setData] = useState({
    title: "",
    code: "",
    image: "",
    type: "",
    description: "",
    newPrice: "",
    oldPrice: "",
    quantity: "",
  });

  const listTypes = useSelector((state) => state.defaultReducer.listType);
  useEffect(() => {
    dispatch(getAllTypeProduct());
  }, []);

  useEffect(() => {
    fetch(`https://phutungxemay.onrender.com/v1/product/${path}`)
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
        data.title !== "" &&
        data.image !== "" &&
        data.code !== "" &&
        data.type !== "" &&
        data.description !== "" &&
        data.newPrice !== "" &&
        data.oldPrice !== "" &&
        data.quantity !== ""
      ) {
        let formData = new FormData();
        formData.append("image", data.image);
        formData.append("code", data.code);
        formData.append("title", data.title);
        formData.append("type", data.type);
        formData.append("description", data.description);
        formData.append("newPrice", data.newPrice);
        formData.append("oldPrice", data.oldPrice);
        formData.append("quantity", data.quantity);

        dispatch(updateProduct(path, formData, navigate));
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
              name="title"
              value={data.title}
              onChange={handleChange("title")}
            />
          </div>
          <div className="mb-3">
            <span>Mã Sản Phẩm</span>
            <input
              className="form-control"
              type="text"
              name="title"
              value={data.code}
              onChange={handleChange("code")}
            />
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
            <span>Mô tả Sản Phẩm</span>
            <textarea
              className="form-control"
              type="text"
              name="description"
              value={data.description}
              onChange={handleChange("description")}
            />
          </div>
          <div className="mb-3">
            <span>Giá Mới</span>
            <input
              className="form-control"
              type="number"
              name="newPrice"
              value={data.newPrice}
              onChange={handleChange("newPrice")}
            />
          </div>
          <div className="mb-3">
            <span>Giá cũ</span>
            <input
              className="form-control"
              type="number"
              name="oldPrice"
              value={data.oldPrice}
              onChange={handleChange("oldPrice")}
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
          <div className="mb-3">
            <span>Số lượng sản phẩm</span>
            <select onChange={handleChange("quantity")}>
              <option value={data.quantity}>{data.quantity}</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
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
