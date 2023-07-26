import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalFooter from 'react-bootstrap/ModalFooter';
import ModalTitle from 'react-bootstrap/ModalTitle';
import Form from 'react-bootstrap/Form';
import { read, utils } from 'xlsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProducts } from '../../../redux/actions/product.action';
import Menu from '../menu/Menu';
import {
  addProductSuppliers,
  deleteProductSupplier,
  getProductSupplier,
} from '../../../redux/actions/productSupplier.action';
import { getSupplier } from '../../../redux/actions/supplier.action';
import { getAllTypeProduct } from '../../../redux/actions/type.action';
import axios from 'axios';
import { Loading } from '../../../components/loading/Loading';
function ListProductSupplier() {
  const [showadd, setShowadd] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('token'));
  const isLoading = useSelector((state) => state.defaultReducer.isLoading);
  const listProductSupplier = useSelector(
    (state) => state.defaultReducer.listProductSupplier
  );
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  console.log(isCreatingProduct);

  const [data, setData] = useState({
    name: '',
    image: '',
    supplier: '',
    // agentCode: "",
    productCode: '',
    salePrice: '',
    retailPrice: '',
    wholesalePrice: '',
    wholesalePriceQuick: '',
    quantity: '',
    link: '',
    type: '',
  });

  const handleChange = (name) => (e) => {
    const value = name === 'image' ? e.target.files[0] : e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (
        data.name !== '' &&
        data.image !== '' &&
        data.supplier !== '' &&
        // data.agentCode !== "" &&
        data.productCode !== '' &&
        data.salePrice !== '' &&
        data.retailPrice !== '' &&
        data.wholesalePrice !== '' &&
        data.wholesalePriceQuick !== '' &&
        data.quantity !== '' &&
        data.link !== ''
      ) {
        setIsCreatingProduct(true);
        let formData = new FormData();
        formData.append('name', data.name);
        formData.append('image', data.image);
        formData.append('supplier', data.supplier);
        // formData.append("agentCode", data.agentCode);
        formData.append('productCode', data.productCode);
        formData.append('salePrice', data.salePrice);
        formData.append('retailPrice', data.retailPrice);
        formData.append('wholesalePrice', data.wholesalePrice);
        formData.append('wholesalePriceQuick', data.wholesalePriceQuick);
        formData.append('quantity', data.quantity);
        formData.append('link', data.link);
        formData.append('type', data.type);
        toast.info('Sản Phẩm Đang Được Xử Lý, Vui Lòng Đợi Tý...', {
          position: toast.POSITION.TOP_CENTER,
        });
        dispatch(addProductSuppliers(formData, currentUser?.accessToken));

        setData({
          name: '',
          image: '',
          supplier: '',
          productCode: '',
          salePrice: '',
          retailPrice: '',
          wholesalePrice: '',
          wholesalePriceQuick: '',
          quantity: '',
          link: '',
          type: '',
        });
        setShowadd(false);
        setIsCreatingProduct(false);
      } else {
        toast.warning('Vui Lòng Nhập Đầy Đủ Các Trường Sản Phẩm', {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const listSuppliers = useSelector(
    (state) => state.defaultReducer.listSupplier
  );
  useEffect(() => {
    dispatch(getSupplier());
  }, []);
  const handleCloseAdd = () => {
    setShowadd(false);
  };
  useEffect(() => {
    const selectedSupplier = listSuppliers.find(
      (supplier) =>
        supplier.name.trim().toLowerCase() ===
        data.supplier.trim().toLowerCase()
    );
    if (selectedSupplier) {
      setData((prevData) => ({
        ...prevData,
        link: selectedSupplier._id, // Assign _id as the link value
      }));
    }
  }, [data.supplier, listSuppliers]);

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
  const [excelFile, setExcelFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setExcelFile(file);
  };

  const handleSubmitEXC = async () => {
    try {
      if (excelFile) {
        const fileReader = new FileReader();
        fileReader.onload = async (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

          const newData = jsonData.filter((row) =>
            row.every((cell) => cell !== '')
          );
          if (newData.length === 0) {
            toast.warning('Không tìm thấy dữ liệu để thêm!', {
              position: toast.POSITION.TOP_CENTER,
            });
            return;
          }

          const emptyColumns = newData.some((row) =>
            row.some((cell) => cell === '')
          );
          if (emptyColumns) {
            toast.warning('Có cột dữ liệu bị để trống trong file Excel!', {
              position: toast.POSITION.TOP_CENTER,
            });
            return;
          }
          setIsCreatingProduct(true);
          const formattedData = newData.slice(1).map((row) => {
            return {
              name: row[0],
              productCode: row[1],
              salePrice: row[2],
              retailPrice: row[3],
              wholesalePrice: row[4],
              wholesalePriceQuick: row[5],
              quantity: row[6],
            };
          });
          const response = await axios.post(
            'https://phutungxemay.onrender.com/v1/productsupplier/addmanyproduct',
            formattedData
          );

          toast.success('Đã nhập dữ liệu từ file Excel thành công!', {
            position: toast.POSITION.TOP_CENTER,
          });

          dispatch(getProductSupplier());
          setIsCreatingProduct(false);
        };

        fileReader.readAsArrayBuffer(excelFile);
      } else {
        toast.warning('Vui lòng chọn một file Excel để nhập dữ liệu!', {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsCreatingProduct(false);
    }
  };

  return (
    <div className="container-listproductAd">
      <div className="row">
        <div className="col-3 menu-admin-dt">
          <Menu />
        </div>
        <div className="col-xl-9 col-sm-12">
          <div className="title-list">
            <div className="row">
              <div className="col-xl-3 col-sm-3">
                <p
                  style={{
                    fontSize: '24px',
                    display: 'flex',
                    padding: '0.3rem',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  Quản lý Sản Phẩm Cung Cấp
                </p>
              </div>
              <div className="col-xl-3 col-sm-3">
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

              <div className="col-xl-3 col-sm-3">
                <input
                  style={{ fontSize: '15px' }}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                />
              </div>
              <div className="col-xl-3 col-sm-3">
                <button
                  href="#"
                  className={`btn btn-outline-danger ${
                    isCreatingProduct ? 'disabled' : ''
                  }`}
                  onClick={handleSubmitEXC}
                >
                  <i className="bx bxs-folder-plus"></i>
                  <span>
                    {isCreatingProduct
                      ? 'Đang nhập dữ liệu...'
                      : 'Nhập Từ File Excel'}
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className="table_responsive">
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Ảnh</th>
                  <th>Tên Sản phẩm</th>
                  <th>Số lượng Kho</th>
                  <th>Giá Sale</th>
                  <th>Giá Bán</th>
                  <th>Giá Vốn</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <Loading />
                ) : (
                  <>
                    {listProductSupplier?.map((item, index) => (
                      <tr>
                        <td>{index + 1}</td>
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
      </div>

      <Modal show={showadd} onHide={handleCloseAdd} className="modal">
        <ModalHeader>
          <ModalTitle>Thêm sản phẩm</ModalTitle>
        </ModalHeader>
        <ModalBody className="modal-body">
          <Form.Group className="formgroup-body">
            <div className="row">
              <div className="col-xl-6 col-sm-12">
                <Form.Label>Tên sản phẩm: </Form.Label>
                <Form.Control
                  type="text"
                  onChange={handleChange('name')}
                  placeholder="Nhập tên sản phẩm..."
                />
              </div>
              <div className="col-xl-6 col-sm-12">
                <Form.Label>Mã sản phẩm: </Form.Label>
                <Form.Control
                  type="text"
                  onChange={handleChange('productCode')}
                  placeholder="Nhập mã sản phẩm..."
                />
              </div>
              <div className="col-xl-6 col-sm-12">
                <Form.Label>Nhà Cung Cấp: </Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={handleChange('supplier')}
                >
                  <option>Chọn loại sản phẩm</option>
                  {listSuppliers?.map((item, index) => (
                    <option value={item.name}>{item.name}</option>
                  ))}
                </Form.Select>
                <input
                  type="hidden"
                  name="supplierName"
                  value={data.supplier}
                />
              </div>
              <div className="col-xl-6 col-sm-12">
                <Form.Label>Loại Sản Phẩm: </Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={handleChange('type')}
                >
                  <option>Chọn loại sản phẩm</option>
                  {listTypes?.map((item, index) => (
                    <option value={item?.name}>{item.name}</option>
                  ))}
                </Form.Select>
              </div>
              <div className="col-xl-6 col-sm-12">
                <Form.Label>Giá khuyến mãi: </Form.Label>
                <Form.Control
                  type="number"
                  onChange={handleChange('salePrice')}
                  placeholder="Nhập giá sale sản phẩm..."
                />
              </div>
              <div className="col-xl-6 col-sm-12">
                <Form.Label>Giá bán: </Form.Label>
                <Form.Control
                  type="number"
                  onChange={handleChange('retailPrice')}
                  placeholder="Nhập giá bán sản phẩm..."
                />
              </div>
              <div className="col-xl-6 col-sm-12">
                <Form.Label>Giá vốn: </Form.Label>
                <Form.Control
                  type="number"
                  onChange={handleChange('wholesalePrice')}
                  placeholder="Nhập giá vốn sản phẩm..."
                />
              </div>
              <div className="col-xl-6 col-sm-12">
                <Form.Label>Giá vốn mua nhanh: </Form.Label>
                <Form.Control
                  type="number"
                  onChange={handleChange('wholesalePriceQuick')}
                  placeholder="Nhập giá vốn mua nhanh sản phẩm..."
                />
              </div>
              <div className="col-xl-6 col-sm-12">
                <Form.Label>Số lượng sản phẩm: </Form.Label>
                <Form.Control
                  type="number"
                  onChange={handleChange('quantity')}
                  placeholder="Nhập số lượng sản phẩm..."
                />
              </div>
              <div className="col-xl-6 col-sm-12">
                <Form.Label>Hình ảnh: </Form.Label>
                <Form.Control
                  type="file"
                  size="sm"
                  accept="image/*"
                  name="image"
                  onChange={handleChange('image')}
                />
              </div>
            </div>
          </Form.Group>
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={isCreatingProduct}
            style={{ background: 'green' }}
            variant="success"
            onClick={handleSubmit}
          >
            {isCreatingProduct ? 'Vui lòng chờ...' : 'Tạo sản phẩm'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ListProductSupplier;
