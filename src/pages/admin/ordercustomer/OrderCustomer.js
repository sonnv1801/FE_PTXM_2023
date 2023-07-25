import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';
import numeral from 'numeral';
import Menu from '../menu/Menu';
export const OrderCustomer = () => {
  const [orders, setOrders] = useState([]);
  const [expandedCombos, setExpandedCombos] = useState([]);
  useEffect(() => {
    fetchOrders();
  }, []);

  console.log(orders, 'orders');

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        'https://phutungxemay.onrender.com/v1/ordercombo'
      ); // Replace with your actual API endpoint
      setOrders(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleToggleComboProducts = (orderId, comboId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order._id === orderId) {
          const updatedCombos = order.combos.map((combo) => {
            if (combo._id === comboId) {
              return {
                ...combo,
                showProducts: !combo.showProducts,
              };
            }
            return combo;
          });
          return {
            ...order,
            combos: updatedCombos,
          };
        }
        return order;
      })
    );
  };

  return (
    <>
      <div className="row">
        <div className="col-3 menu-admin-dt">
          <Menu />
        </div>
        <div className="col-xl-9 col-sm-12">
          {orders.length === 0 ? (
            <div className="alert alert-warning m-3" role="alert">
              Hiện Tại Chưa Có Sản Phẩm Nào!
            </div>
          ) : (
            <div className="order-list container">
              {orders.map((order, index) => (
                <div key={order._id} className="order">
                  <h2 style={{ fontSize: '15px', color: 'green' }}>
                    Khách hàng: {order.name}
                  </h2>
                  <h2 style={{ fontSize: '15px', color: 'green' }}>
                    Đơn Hàng: {index + 1}
                  </h2>
                  <h2 style={{ fontSize: '15px', color: 'green' }}>
                    Mã Đơn Hàng: {order._id}
                  </h2>
                  <h3 style={{ margin: '1rem 0' }}>Sản phẩm phụ tùng:</h3>

                  <div className="table_responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Ảnh</th>
                          <th>Giá</th>
                          <th>Số lượng đặt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.products.map((product, index) => (
                          <tr>
                            <td>{index + 1}</td>
                            <td>
                              <img src={product.image} alt={product.title} />
                            </td>
                            <td>{`${numeral(product.newPrice).format(
                              '0,0'
                            )}đ`}</td>
                            <td>{product.quantity_cart}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <hr className="divider" />
                  {order.combos.length > 0 ? (
                    <>
                      <h3 style={{ margin: '1rem 0' }}>Combos:</h3>

                      <div className="table_responsive">
                        <table>
                          <thead>
                            <tr>
                              <th>STT</th>
                              <th>Tên Combo</th>
                              <th>Số lượng đặt</th>
                              <th>Tổng Tiền</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.combos.map((combo, index) => (
                              <tr>
                                <td>{index + 1}</td>
                                <td>{combo.comboName}</td>
                                <td>{combo.quantityCombo}</td>
                                <td>
                                  {' '}
                                  {`${numeral(
                                    combo.quantityCombo * combo.subtotal
                                  ).format('0,0')}đ`}
                                </td>
                                <td>
                                  <button
                                    style={{ background: 'blue' }}
                                    className="toggle-combo-products-btn"
                                    onClick={() =>
                                      handleToggleComboProducts(
                                        order._id,
                                        combo._id
                                      )
                                    }
                                  >
                                    {combo.showProducts ? 'Ẩn' : 'Xem thêm'}
                                  </button>
                                  {combo.showProducts ? (
                                    combo.products.length > 0 ? (
                                      <div className="table_responsive">
                                        <table>
                                          <thead>
                                            <tr>
                                              <th>Tên sản phẩm</th>
                                              <th>Giá</th>
                                              <th>Số lượng đặt</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {combo.products.map((product) => (
                                              <tr
                                                key={product._id}
                                                className="combo-product"
                                              >
                                                <td>{product.title}</td>
                                                <td>{`${numeral(
                                                  product.price
                                                ).format('0,0')}đ`}</td>
                                                <td>{product.quantity}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    ) : (
                                      <p style={{ color: 'red' }}>
                                        Hiện tại chưa có sản phẩm combo nào cho
                                        order này.
                                      </p>
                                    )
                                  ) : null}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <p style={{ color: 'red' }}>
                      Hiện tại chưa có sản phẩm combo nào cho order này.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
