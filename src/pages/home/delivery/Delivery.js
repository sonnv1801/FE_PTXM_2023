import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Menu from '../../admin/menu/Menu';
import Button from '@mui/material/Button';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Link } from 'react-router-dom';
const Delivery = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deliveryQuantity, setDeliveryQuantity] = useState(0);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        'https://phutungxemay.onrender.com/v1/order'
      );
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  console.log(orders, 'orders');

  const handleOrderClick = (order) => {
    order.expanded = !order.expanded;
    setSelectedOrder({ ...order }); // Create a new object to trigger re-render
    setSelectedProduct(null);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setDeliveryQuantity(0);
  };

  const handleDelivery = async () => {
    try {
      if (!selectedOrder || !selectedProduct) {
        toast.error('Vui lòng chọn đơn hàng và sản phẩm cần giao.', {
          position: toast.POSITION.TOP_CENTER,
        });
        return;
      }

      const response = await axios.post(
        `https://phutungxemay.onrender.com/v1/delivery/${selectedOrder._id}`,
        {
          productCode: selectedProduct.productCode,
          quantity: deliveryQuantity,
          customerId: selectedOrder.customerId,
        }
      );
      toast.success('Giao hàng thành công!', {
        position: toast.POSITION.TOP_CENTER,
      });
      setSelectedOrder(null);
      setSelectedProduct(null);
      setDeliveryQuantity(0);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error, {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.', {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
  };

  const handleDeleteOrderDelivery = async (orderId) => {
    setIsCreatingProduct(true);
    try {
      const response = await axios.delete(
        `https://phutungxemay.onrender.com/v1/delivery/order/${orderId}`
      );
      toast.success(`${response.data.message}`, {
        position: toast.POSITION.TOP_CENTER,
      });
      fetchOrders();
    } catch (error) {
      console.log(error);
    } finally {
      setIsCreatingProduct(false);
    }
  };

  return (
    <div className="row">
      <div className="col-3 menu-admin-dt">
        <Menu />
      </div>
      <div className="col-xl-9 col-sm-12">
        <div className="container">
          <h1 className="heading">Đơn Hàng Của Khách & Giao Hàng Còn Thiếu</h1>

          {orders.length === 0 ? (
            <div className="alert alert-warning m-3" role="alert">
              Hiện Tại Chưa Có Đơn Hàng Nào!
            </div>
          ) : (
            <>
              {orders.map((order, index) => (
                <li key={order._id} className="order-item-huhu">
                  {/* <button
                    style={{ float: 'right' }}
                    className="btn btn-danger"
                    onClick={() => handleDeleteOrderDelivery(order._id)}
                  >
                    {isCreatingProduct ? (
                      'Vui lòng chờ...'
                    ) : (
                      <i className="fa fa-trash"></i>
                    )}
                  </button> */}
                  <p
                    style={{
                      color: 'green',
                      marginBottom: '1rem',
                      fontWeight: '500',
                    }}
                    className="order-id"
                  >
                    Đơn Hàng: {index + 1}
                  </p>
                  <p
                    style={{
                      color: 'green',
                      marginBottom: '1rem',
                      fontWeight: '500',
                    }}
                    className="order-id"
                  >
                    Mã Đơn Hàng: {order._id}
                  </p>
                  <p
                    style={{
                      color: 'green',
                      marginBottom: '1rem',
                      fontWeight: '500',
                    }}
                    className="customer-id"
                  >
                    ID Khách hàng: {order.customerId}
                  </p>
                  <p
                    style={{
                      color: 'green',
                      marginBottom: '1rem',
                      fontWeight: '500',
                    }}
                    className="missing-products"
                  >
                    Số lượng sản phẩm còn thiếu:{' '}
                    {
                      order.products.filter(
                        (product) =>
                          product.quantityDelivered < product.quantityOrdered
                      ).length
                    }
                  </p>
                  <button
                    className="order-button"
                    onClick={() => handleOrderClick(order)}
                  >
                    {order.expanded ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                  </button>

                  {order.expanded &&
                    order.products.filter(
                      (product) =>
                        product.quantityDelivered < product.quantityOrdered
                    ).length > 0 && (
                      <div className="products-miss">
                        <h2 className="sub-heading">Thông tin đơn hàng:</h2>
                        <p
                          style={{
                            color: 'green',
                            marginBottom: '1rem',
                            fontWeight: '500',
                          }}
                          className="order-id"
                        >
                          ID: {order._id}
                        </p>
                        <p
                          style={{
                            color: 'green',
                            marginBottom: '1rem',
                            fontWeight: '500',
                          }}
                          className="customer-id"
                        >
                          ID Khách hàng: {order.customerId}
                        </p>
                        <h3 className="missing-products-heading">
                          Sản phẩm còn thiếu:
                        </h3>
                        <Link to="/prducts-supplier">
                          <Button
                            className="mt-2 mb-2"
                            variant="contained"
                            endIcon={<ArrowRightAltIcon />}
                          >
                            Quay Lại Sản Phẩm Nhà Cung Cấp
                          </Button>
                        </Link>
                        <ul className="product-list">
                          {order.products.map(
                            (product) =>
                              product.quantityDelivered <
                                product.quantityOrdered && (
                                <li key={product._id} className="product-item">
                                  <p
                                    style={{
                                      color: 'green',
                                      marginBottom: '1rem',
                                      fontWeight: '500',
                                    }}
                                    className="product-code"
                                  >
                                    Mã sản phẩm: {product.productCode}
                                  </p>
                                  <p
                                    style={{
                                      color: 'green',
                                      marginBottom: '1rem',
                                      fontWeight: '500',
                                    }}
                                    className="missing-quantity"
                                  >
                                    Số lượng còn thiếu:{' '}
                                    {product.quantityOrdered -
                                      product.quantityDelivered}
                                  </p>
                                  <button
                                    className="delivery-button"
                                    onClick={() => handleProductClick(product)}
                                  >
                                    Giao hàng
                                  </button>
                                </li>
                              )
                          )}
                        </ul>
                        {selectedProduct && (
                          <div id="dilivery-orders">
                            <h2 className="sub-heading">Giao hàng:</h2>
                            <p
                              style={{
                                color: 'green',
                                marginBottom: '1rem',
                                fontWeight: '500',
                              }}
                              className="order-id"
                            >
                              Đơn hàng: {order._id}
                            </p>
                            <p
                              style={{
                                color: 'green',
                                marginBottom: '1rem',
                                fontWeight: '500',
                              }}
                              className="product-code"
                            >
                              Mã sản phẩm: {selectedProduct.productCode}
                            </p>
                            <div className="quantitys-orders">
                              <label
                                htmlFor="deliveryQuantity"
                                className="label"
                              >
                                Số lượng giao:
                              </label>
                              <input
                                type="number"
                                id="deliveryQuantity"
                                className="input"
                                value={deliveryQuantity}
                                onChange={(e) =>
                                  setDeliveryQuantity(e.target.value)
                                }
                                inputMode="numeric"
                              />

                              <button
                                className="delivery-button"
                                onClick={handleDelivery}
                              >
                                Gửi hàng
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                </li>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Delivery;
