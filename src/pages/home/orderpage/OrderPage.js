import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';
import 'react-toastify/dist/ReactToastify.css';
import numeral from 'numeral';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [supplierFilter, setSupplierFilter] = useState('');
  const [deliveryDateFilter, setDeliveryDateFilter] = useState({});
  const [productTypeFilter, setProductTypeFilter] = useState('');
  const [loadingStates, setLoadingStates] = useState({}); // Initialize as an empty object

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, supplierFilter, deliveryDateFilter, productTypeFilter]);

  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('token'));
      const customerId = user?._id;
      const response = await axios.get(
        `https://phutungxemay.onrender.com/v1/order/${customerId}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchOrderHistories = async (orderId) => {
    try {
      const user = JSON.parse(localStorage.getItem('token'));

      // Set the loading state to true for the corresponding order
      setLoadingStates((prevStates) => ({
        ...prevStates,
        [orderId]: true,
      }));

      const response = await axios.get(
        `https://phutungxemay.onrender.com/v1/delivery/${user?._id}/${orderId}`
      );

      // Update the order's histories and set the loading state to false
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, histories: response.data } : order
        )
      );

      // Set the loading state to false for the corresponding order
      setLoadingStates((prevStates) => ({
        ...prevStates,
        [orderId]: false,
      }));
    } catch (error) {
      console.error('Error fetching order histories:', error);
      // Set the loading state to false in case of an error
      setLoadingStates((prevStates) => ({
        ...prevStates,
        [orderId]: false,
      }));
    }
  };

  const applyFilters = () => {
    let filteredOrders = orders;

    // Apply supplier filter
    if (supplierFilter) {
      filteredOrders = filteredOrders.filter((order) => {
        return order.products.some(
          (product) => product.supplier === supplierFilter
        );
      });
    }

    // Apply product type filter
    if (productTypeFilter) {
      filteredOrders = filteredOrders.filter((order) => {
        return order.products.some((product) => {
          return (
            product.type === productTypeFilter &&
            product.supplier === supplierFilter
          );
        });
      });
    }

    setFilteredOrders(filteredOrders);
  };
  const calculateTotalValues = (orders) => {
    const totalValues = {
      price: 0,
      total: 0,
      profit: 0,
      totalProfit: 0,
      quantityOrdered: 0,
      quantityDelivered: 0,
    };

    filteredOrders?.forEach((order) => {
      order.products?.forEach((product) => {
        totalValues.price += product.productPrice;
        totalValues.total += product.totalPrice;
        totalValues.profit += product.productProfit;
        totalValues.totalProfit += product.totalProfit;
        totalValues.quantityOrdered += product.quantityOrdered;
        totalValues.quantityDelivered += product.quantityDelivered;
      });
    });

    return totalValues;
  };

  const filteredTotalValues = calculateTotalValues(filteredOrders);

  return (
    <>
      <div className="order-page container">
        <h1>Đơn Hàng Của Bạn</h1>
        <Link to="/">
          <Button
            variant="outlined"
            endIcon={<ArrowRightIcon />}
            // onClick={handlePurchase}
            style={{ margin: '0', marginLeft: '1rem' }}
          >
            Quay Lại Admin
          </Button>
        </Link>
        {orders.length === 0 ? (
          <div className="alert alert-warning mt-3" role="alert">
            Hiện Tại Chưa Có Đơn Hàng Nào Đặt Từ Nhà Cung Cấp
          </div>
        ) : (
          <div className="order-list">
            <div className="filters row">
              <div className="col-xl-4 col-sm-12">
                <label htmlFor="supplier-filter">Nhà cung cấp:</label>
                <select
                  className="form-select form-select-sm"
                  aria-label=".form-select-sm example"
                  id="supplier-filter"
                  value={supplierFilter}
                  onChange={(e) => setSupplierFilter(e.target.value)}
                >
                  <option value="">Tất cả</option>
                  {orders
                    .flatMap((order) =>
                      order.products.map((product) => product.supplier)
                    )
                    .filter(
                      (supplier, index, suppliers) =>
                        suppliers.indexOf(supplier) === index
                    )
                    .map((supplier) => (
                      <option value={supplier} key={supplier}>
                        {supplier}
                      </option>
                    ))}
                </select>
              </div>

              <div className="col-xl-4 col-sm-12">
                <label htmlFor="delivery-date-start">Từ ngày:</label>
                <input
                  type="date"
                  id="delivery-date-start"
                  value={deliveryDateFilter.startDate || ''}
                  onChange={(e) =>
                    setDeliveryDateFilter((prevState) => ({
                      ...prevState,
                      startDate: e.target.value,
                    }))
                  }
                />

                <label htmlFor="delivery-date-end">Đến ngày:</label>
                <input
                  type="date"
                  id="delivery-date-end"
                  value={deliveryDateFilter.endDate || ''}
                  onChange={(e) =>
                    setDeliveryDateFilter((prevState) => ({
                      ...prevState,
                      endDate: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="col-xl-4 col-sm-12">
                <label htmlFor="product-type-filter">Loại sản phẩm:</label>
                <select
                  className="form-select form-select-sm"
                  aria-label=".form-select-sm example"
                  id="product-type-filter"
                  value={productTypeFilter}
                  onChange={(e) => setProductTypeFilter(e.target.value)}
                >
                  <option value="">Tất cả</option>
                  {orders
                    .flatMap((order) =>
                      order.products.map((product) => product.type)
                    )
                    .filter(
                      (type, index, types) => types.indexOf(type) === index
                    )
                    .map((type) => (
                      <option value={type} key={type}>
                        {type}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <p>Không có đơn hàng phù hợp với các bộ lọc.</p>
            ) : (
              <div>
                <div className="order-list">
                  {filteredOrders.map((order) => (
                    <div key={order._id} className="order-item">
                      <div key={order._id} className="order-item">
                        <h3 style={{ margin: '1rem 0' }}>Sản phẩm:</h3>

                        <div className="table_responsive">
                          <table>
                            <thead>
                              <tr>
                                <th>Mã sản phẩm</th>
                                <th>Nhà Cung Cấp</th>
                                <th>Loại Sản Phẩm</th>
                                <th>Số lượng đặt</th>
                                <th>Số lượng đã giao</th>
                                <th>Trạng thái</th>
                                <th>Giao Hàng</th>
                                <th>Giá bán</th>
                                <th>Tổng</th>
                                <th>Tiền lời</th>
                                <th>Tổng lời tạm tính</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.products.map((product) => (
                                <tr key={product._id}>
                                  <td>{product.productCode}</td>
                                  <td>{product.supplier}</td>
                                  <td>{product.type}</td>
                                  <td>{product.quantityOrdered}</td>
                                  <td>{product.quantityDelivered}</td>
                                  <td>
                                    {product.deliveryStatus === 'pending'
                                      ? 'Chưa giao xong'
                                      : 'Hoàn Thành'}
                                  </td>
                                  <td>
                                    {product.fastDelivery === true
                                      ? 'Giao Hàng Nhanh'
                                      : 'Giao Hàng Thường'}
                                  </td>
                                  <td>{`${numeral(product.productPrice).format(
                                    '0,0'
                                  )}đ`}</td>
                                  <td>{`${numeral(product.totalPrice).format(
                                    '0,0'
                                  )}đ`}</td>
                                  <td>{`${numeral(product.productProfit).format(
                                    '0,0'
                                  )}đ`}</td>
                                  <td>{`${numeral(product.totalProfit).format(
                                    '0,0'
                                  )}đ`}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {order.histories ? (
                          <>
                            <h3 style={{ margin: '1rem 0' }}>Lịch sử</h3>

                            <div className="table_responsive">
                              <table>
                                <thead>
                                  <tr>
                                    <th>Ngày giao</th>
                                    <th>Giao cho khách hàng</th>
                                    <th>Mã sản phẩm</th>
                                    <th>Đã giao</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.histories.map((history) => (
                                    <tr key={history._id}>
                                      <td>
                                        {moment(history.deliveryDate).format(
                                          'DD/MM/YYYY'
                                        )}
                                      </td>
                                      <td>{history.customerId}</td>
                                      <td>{history.productCode}</td>
                                      <td>{history.quantity}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : (
                          <button
                            disabled={loadingStates[order._id]} // Disable the button if loadingStates[order._id] is true
                            onClick={() => fetchOrderHistories(order._id)}
                          >
                            {loadingStates[order._id]
                              ? 'Vui lòng chờ...'
                              : 'Xem lịch sử đơn hàng'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <h3 style={{ margin: '1rem 0' }}>Tổng</h3>
                  <div
                    className="table_responsive"
                    style={{ margin: '1rem 0' }}
                  >
                    <table>
                      <thead>
                        <tr>
                          <th>Tổng Số Lượng Đặt</th>
                          <th>Tổng Số lượng đã giao</th>
                          <th>Tổng Giá Bán</th>
                          <th>Tổng Tiền</th>
                          <th>Tổng Tiền Lời</th>
                          <th>Tổng Lời</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{filteredTotalValues.quantityOrdered}</td>
                          <td>{filteredTotalValues.quantityDelivered}</td>
                          <td>
                            {numeral(filteredTotalValues.price).format('0,0')}đ
                          </td>
                          <td>
                            {numeral(filteredTotalValues.total).format('0,0')}đ
                          </td>
                          <td>
                            {numeral(filteredTotalValues.profit).format('0,0')}đ
                          </td>
                          <td>
                            {numeral(filteredTotalValues.totalProfit).format(
                              '0,0'
                            )}
                            đ
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default OrderPage;
