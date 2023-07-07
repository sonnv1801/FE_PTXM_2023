import React, { useState } from "react";

const AddProductToComBo = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    productCode: "",
    images: null,
    price: 0,
    oldPrice: 0,
    status: "",
    quantity: 0,
  });

  const handleNewProductInputChange = (event) => {
    const { name, value } = event.target;
    setNewProduct((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNewProductImageChange = (event) => {
    const file = event.target.files[0];
    setNewProduct((prevData) => ({ ...prevData, images: file }));
  };
  return (
    <div className="col-6">
      <div className="add-product-combo">
        <h3>Thêm sản phẩm vào combo</h3>
        <div className="mb-3">
          <div className="mb-3">
            <span>Hình ảnh Sản Phẩm</span>
            <img style={{ width: "100px" }} src="" alt="" />
          </div>
          <span> Hình ảnh Sản Phẩm</span>
          <input className="form-control" type="file" name="image" />
        </div>
        <div className="mb-3">
          <span>Tên Sản Phẩm</span>
          <input className="form-control" type="text" name="name" />
        </div>
        <div className="mb-3">
          <span>Mã sản phẩm</span>
          <input className="form-control" type="text" name="productCode" />
        </div>
        <div className="mb-3">
          <span>Giá Mới</span>
          <input className="form-control" type="number" name="price" />
        </div>
        <div className="mb-3">
          <span>Giá cũ</span>
          <input className="form-control" type="number" name="oldPrice" />
        </div>
        <div className="mb-3">
          <span>Trạng Thái</span>
          <select
            style={{
              width: "100%",
              margin: "0.5rem 0",
              border: "1px solid #ced4da",
              outline: "none",
              padding: "0.4rem",
            }}
            name="status"
          >
            <option value="Còn Hàng">Còn Hàng</option>
            <option value="Còn Hàng">Còn Hàng</option>
            <option value="Hết Hàng">Hết Hàng</option>
          </select>
        </div>
        <div className="mb-3">
          <span>Số lượng</span>
          <input className="form-control" type="number" name="quantity" />
        </div>

        <button style={{ background: "blue", margin: "1rem 0" }}>
          Thêm vào combo
        </button>
      </div>
    </div>
  );
};

export default AddProductToComBo;
