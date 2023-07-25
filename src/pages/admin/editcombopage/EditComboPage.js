import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './style.css';
import { getAllTypeProductCombo } from '../../../redux/actions/typecombo.action';

const EditComboPage = () => {
  const location = useLocation();
  const path = location.pathname.split('/')[2];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [newImage, setNewImage] = useState(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  const [data, setData] = useState({
    image: null,
    quantity: Number,
    title: '',
    type: '',
    link: '',
    newPrice: Number,
    status: '',
    products: [
      {
        name: '',
        productCode: '',
        images: null,
        price: Number,
        oldPrice: Number,
        status: '',
        quantity: Number,
      },
    ],
  });

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

  useEffect(() => {
    const selectedSupplier = listTypeComBos.find(
      (supplier) =>
        supplier.name?.trim()?.toLowerCase() ===
        data.type?.trim()?.toLowerCase()
    );
    if (selectedSupplier) {
      setData((prevData) => ({
        ...prevData,
        link: selectedSupplier._id,
      }));
    }
  }, [data.type, listTypeComBos]);

  const handleComboImageChange = (event) => {
    const file = event.target.files[0];
    setData((prevData) => ({ ...prevData, image: file }));
    setNewImage(URL.createObjectURL(file));
  };

  const handleProductImageChange = (index, event) => {
    const file = event.target.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      const base64Image = reader.result;

      setData((prevData) => {
        const updatedProducts = [...prevData.products];
        updatedProducts[index].images = base64Image;
        updatedProducts[index].imageChanged = true;
        return { ...prevData, products: updatedProducts };
      });
    };

    reader.readAsDataURL(file);
  };

  const handleComboInputChange = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleProductInputChange = (index, event) => {
    const { name, value } = event.target;
    setData((prevData) => {
      const updatedProducts = [...prevData.products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        [name]: value,
      };
      return { ...prevData, products: updatedProducts };
    });
  };

  const handleSaveChanges = () => {
    setIsCreatingProduct(true);
    const url = `https://phutungxemay.onrender.com/v1/combo/combos/${path}`;

    const formData = new FormData();
    formData.append('image', data.image);
    formData.append('quantity', data.quantity);
    formData.append('title', data.title);
    formData.append('type', data.type);
    formData.append('link', data.link);
    formData.append('newPrice', data.newPrice);
    formData.append('status', data.status);

    // Append product data
    data.products?.forEach((product, index) => {
      formData.append(`products[${index}][name]`, product.name);
      formData.append(`products[${index}][productCode]`, product.productCode);
      formData.append(`products[${index}][images]`, product.images);
      formData.append(`products[${index}][price]`, product.price);
      formData.append(`products[${index}][oldPrice]`, product.oldPrice);
      formData.append(`products[${index}][status]`, product.status);
      formData.append(`products[${index}][quantity]`, product.quantity);
    });

    axios
      .put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        toast.success('Lưu thay đổi thành công');
        navigate('/list-products-combos-admin');
      })
      .catch((error) => {
        console.error(error);
        toast.error('Lưu thay đổi thất bại');
      })
      .finally(() => {
        setIsCreatingProduct(false);
      });
  };

  const [newProduct, setNewProduct] = useState({
    name: '',
    productCode: '',
    images: null,
    price: Number,
    oldPrice: Number,
    status: '',
    quantity: Number,
    remainingQuantity: Number,
  });

  const handleNewProductInputChange = (event) => {
    const { name, value } = event.target;
    setNewProduct((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNewProductImageChange = (event) => {
    const file = event.target.files[0];
    setNewProduct((prevData) => ({ ...prevData, images: file }));
  };

  const handleAddProductToCombo = async () => {
    try {
      setIsCreatingProduct(true);

      // Kiểm tra xem có nhập đầy đủ thông tin sản phẩm không
      if (
        !newProduct.name ||
        !newProduct.productCode ||
        !newProduct.images ||
        !newProduct.price ||
        !newProduct.oldPrice ||
        !newProduct.status ||
        !newProduct.quantity ||
        !newProduct.remainingQuantity
      ) {
        throw new Error('Vui lòng nhập đầy đủ thông tin sản phẩm');
      }

      const url = `https://phutungxemay.onrender.com/v1/combo/combo/${path}/products`;

      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('productCode', newProduct.productCode);
      formData.append('price', newProduct.price);
      formData.append('oldPrice', newProduct.oldPrice);
      formData.append('status', newProduct.status);
      formData.append('quantity', newProduct.quantity);
      formData.append('remainingQuantity', newProduct.remainingQuantity);
      formData.append('image', newProduct.images);

      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newProductData = response.data;

      setData((prevData) => {
        const updatedProducts = [...prevData.products, newProductData];
        return { ...prevData, products: updatedProducts };
      });

      // Reset input fields after successful addition
      setNewProduct({
        name: '',
        productCode: '',
        images: null,
        price: Number,
        oldPrice: Number,
        status: '',
        quantity: Number,
        remainingQuantity: Number,
      });

      toast.success('Thêm sản phẩm vào combo thành công');
      navigate('/list-products-combos-admin');
    } catch (error) {
      console.error(error);
      toast.error('Thêm sản phẩm vào combo thất bại');
    } finally {
      setIsCreatingProduct(false);
    }
  };

  const handleRemoveProduct = (index) => {
    const productId = data.products[index]._id; // Lấy ID của sản phẩm

    axios
      .delete(
        `https://phutungxemay.onrender.com/v1/combo/combo/${path}/product/${productId}`
      )
      .then(() => {
        setData((prevData) => {
          const updatedProducts = [...prevData.products];
          updatedProducts.splice(index, 1);
          return { ...prevData, products: updatedProducts };
        });
        toast.success('Xóa sản phẩm thành công');
      })
      .catch((error) => {
        console.error(error);
        toast.error('Xóa sản phẩm thất bại');
      });
  };

  return (
    <div className="edit-combo-page container">
      <ToastContainer />
      <div className="edit-combo-header">
        <h1>Chỉnh Sửa Sản Phẩm ComBo</h1>
        <button
          onClick={handleSaveChanges}
          encType="multipart/form-data"
          disabled={isCreatingProduct}
        >
          {isCreatingProduct ? 'Vui lòng chờ...' : 'Lưu Thay Đổi'}
        </button>
        <Link to="/list-products-combos-admin">
          <button>Thoát</button>
        </Link>
      </div>
      <div className="edit-combo-content">
        <div className="row">
          <div className="col-xl-6 col-sm-12">
            <h3>Sửa Combo</h3>
            <div className="combo-info" style={{ marginTop: '2rem' }}>
              <div className="mb-3">
                <div className="mb-3">
                  <span>Hình ảnh Sản Phẩm ComBo</span>
                  <img
                    style={{ width: '100px' }}
                    src={newImage || data.image}
                    alt={data.title}
                  />
                </div>
                <span>Chọn hình ảnh Sản Phẩm ComBo</span>
                <input
                  type="file"
                  size="sm"
                  placeholder="Hình ảnh combo Sản Phẩm..."
                  accept="image/*"
                  name="image"
                  onChange={handleComboImageChange}
                />
              </div>
              <div className="mb-3">
                <span>Tên sản phẩm combo</span>
                <input
                  className="form-control"
                  placeholder="Nhập tên sản phẩm combo..."
                  type="text"
                  name="title"
                  value={data.title}
                  onChange={handleComboInputChange}
                />
              </div>
              <div className="mb-3">
                <span>Số lượng</span>
                <input
                  className="form-control"
                  placeholder="Nhập số lượng combo..."
                  type="number"
                  name="quantity"
                  value={data.quantity}
                  onChange={handleComboInputChange}
                />
              </div>
              <div className="mb-3">
                <span>Chọn loại combo</span>
                <select
                  style={{
                    width: '100%',
                    margin: '0.5rem 0',
                    border: '1px solid #ced4da',
                    outline: 'none',
                    padding: '0.4rem',
                  }}
                  name="type"
                  value={data.type}
                  onChange={handleComboInputChange}
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
                <span>Chọn trạng thái</span>
                <select
                  style={{
                    width: '100%',
                    margin: '0.5rem 0',
                    border: '1px solid #ced4da',
                    outline: 'none',
                    padding: '0.4rem',
                  }}
                  name="status"
                  value={data.status}
                  onChange={handleComboInputChange}
                >
                  <option value="Còn Hàng">Còn Hàng</option>
                  <option value="Hết Hàng">Hết Hàng</option>
                </select>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-sm-12">
            <div className="add-product-combo">
              <h3>Thêm sản phẩm vào combo</h3>
              <div className="mb-3">
                <div className="mb-3">
                  <span>Hình ảnh Sản Phẩm Đã Chọn</span>
                  <img
                    style={{ width: '100px' }}
                    src={
                      newProduct.images
                        ? URL.createObjectURL(newProduct.images)
                        : ''
                    }
                    alt=""
                  />
                </div>
                <span> Hình ảnh Sản Phẩm</span>
                <input
                  className="form-control"
                  type="file"
                  size="sm"
                  placeholder="Hình ảnh combo Sản Phẩm..."
                  accept="image/*"
                  name="image"
                  onChange={(e) => handleNewProductImageChange(e)}
                />
              </div>

              <div className="mb-3">
                <span>Tên Sản Phẩm</span>
                <input
                  className="form-control"
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={(e) => handleNewProductInputChange(e)}
                />
              </div>
              <div className="mb-3">
                <span>Mã sản phẩm</span>
                <input
                  className="form-control"
                  type="text"
                  name="productCode"
                  value={newProduct.productCode}
                  onChange={(e) => handleNewProductInputChange(e)}
                />
              </div>
              <div className="mb-3">
                <span>Giá Mới</span>
                <input
                  className="form-control"
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={(e) => handleNewProductInputChange(e)}
                />
              </div>
              <div className="mb-3">
                <span>Giá cũ</span>
                <input
                  className="form-control"
                  type="number"
                  name="oldPrice"
                  value={newProduct.oldPrice}
                  onChange={(e) => handleNewProductInputChange(e)}
                />
              </div>
              <div className="mb-3">
                <span>Trạng Thái</span>
                <select
                  style={{
                    width: '100%',
                    margin: '0.5rem 0',
                    border: '1px solid #ced4da',
                    outline: 'none',
                    padding: '0.4rem',
                  }}
                  name="status"
                  value={newProduct.status}
                  onChange={(e) => handleNewProductInputChange(e)}
                >
                  <option value="">Lựa chọn trạng thái</option>
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
                  onChange={(e) => handleNewProductInputChange(e)}
                />
              </div>
              <div className="mb-3">
                <span>Tồn Kho</span>
                <input
                  className="form-control"
                  type="number"
                  name="remainingQuantity"
                  value={newProduct.remainingQuantity}
                  onChange={(e) => handleNewProductInputChange(e)}
                />
              </div>
              <button
                disabled={isCreatingProduct}
                style={{ background: 'blue', margin: '1rem 0' }}
                onClick={handleAddProductToCombo}
              >
                {isCreatingProduct ? 'Vui lòng chờ...' : ' Thêm vào combo'}
              </button>
            </div>
          </div>

          <div className="col-xl-12 col-sm-12">
            <h2>Danh sách sản phẩm Trong ComBo</h2>

            <div className="table_responsive">
              <table>
                <thead>
                  <tr>
                    <th>Hình ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Mã sản phẩm</th>
                    <th>Giá</th>
                    <th>Giá cũ</th>
                    <th>Trạng thái</th>
                    <th>Số lượng</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {data.products &&
                    data.products.map((product, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <img
                            style={{ width: '50px', padding: '0.6rem' }}
                            src={product.images}
                            alt={product.name}
                          />
                          <input
                            className="form-control"
                            type="file"
                            size="sm"
                            placeholder="Hình ảnh combo Sản Phẩm..."
                            accept="image/*"
                            name="images"
                            onChange={(e) => handleProductImageChange(index, e)}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            placeholder="Nhập tên sản phẩm..."
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={(e) => handleProductInputChange(index, e)}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Nhập mã sản phẩm..."
                            name="productCode"
                            value={product.productCode}
                            onChange={(e) => handleProductInputChange(index, e)}
                          />
                        </td>

                        <td>
                          <input
                            className="form-control"
                            type="number"
                            placeholder="Nhập giá mới sản phẩm..."
                            name="price"
                            value={product.price}
                            onChange={(e) => handleProductInputChange(index, e)}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="number"
                            placeholder="Nhập giá cũ sản phẩm..."
                            name="oldPrice"
                            value={product.oldPrice}
                            onChange={(e) => handleProductInputChange(index, e)}
                          />
                        </td>
                        <td>
                          <select
                            style={{
                              width: '100%',
                              margin: '0.5rem 0',
                              border: '1px solid #ced4da',
                              outline: 'none',
                              padding: '0.4rem',
                            }}
                            name="status"
                            value={product.status}
                            onChange={(e) => handleProductInputChange(index, e)}
                          >
                            <option value="Còn Hàng">Còn Hàng</option>
                            <option value="Hết Hàng">Hết Hàng</option>
                          </select>
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="number"
                            placeholder="Nhập số lượng sản phẩm..."
                            name="quantity"
                            value={product.quantity}
                            onChange={(e) => handleProductInputChange(index, e)}
                          />
                        </td>
                        <td>
                          <button
                            style={{ background: 'red', margin: '1rem 0' }}
                            onClick={() => handleRemoveProduct(index)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditComboPage;
