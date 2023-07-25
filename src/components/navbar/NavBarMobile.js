import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getSupplier } from '../../redux/actions/supplier.action';

export const NavBarMobile = ({
  listTypePhuTung,
  listTypeCombo,
  renderQuantity,
  user,
  handlelogout,
  refreshPage,
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSupplier());
  }, []);

  return (
    <div id="sm-navbar-mobile">
      <div style={{ marginTop: '6.1rem' }}></div>
      <nav className="navbar bg-body-tertiary fixed-top sm-navbar-container">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand" href="#!" onClick={refreshPage}>
            Quốc Nguyên
          </Link>
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
            id="btn-menu-sm"
          >
            <i className="fa fa-align-justify navbar-toggler-icon navbar-toggler"></i>
          </button>
          <div
            className="offcanvas offcanvas-end"
            tabindex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header">
              <Link
                to="/"
                className="offcanvas-title"
                id="offcanvasNavbarLabel"
                onClick={refreshPage}
              >
                Phụ Tùng Xe Máy Quốc Nguyên
              </Link>
              <i
                className=" btn-close navbar-toggler-icon navbar-toggler"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></i>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item dropdown">
                  <p
                    className="nav-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ color: 'black' }}
                  >
                    Phụ Tùng Xe Máy
                  </p>
                  <ul className="dropdown-menu">
                    {listTypePhuTung?.map((item, index) => (
                      <li>
                        <Link
                          to={`/shop/${item.name}`}
                          className="dropdown-item"
                          onClick={refreshPage}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <p
                    className="nav-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ color: 'black' }}
                  >
                    ComBo Xe Máy
                  </p>
                  <ul className="dropdown-menu">
                    {listTypeCombo?.map((item, index) => (
                      <li>
                        <Link
                          to={`/shopcombo/${item._id}`}
                          className="dropdown-item"
                          onClick={refreshPage}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="nav-item">
                  <Link
                    to="/contact"
                    className="nav-link active"
                    aria-current="page"
                    style={{ color: 'black' }}
                    onClick={refreshPage}
                  >
                    Liên Hệ
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/shop/product-dt/cart"
                    className="nav-link active"
                    aria-current="page"
                    style={{ color: 'black' }}
                    onClick={refreshPage}
                  >
                    Giỏ Hàng ({renderQuantity})
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <p
                    className="nav-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ color: 'black' }}
                  >
                    Người Dùng
                  </p>
                  <ul className="dropdown-menu">
                    {user === null ? (
                      'Vui Lòng Đặt Nhập Để Xem Thêm!'
                    ) : (
                      <>
                        <Link
                          to="/history"
                          className="dropdown-item"
                          onClick={refreshPage}
                        >
                          Đơn Hàng Của Bạn
                        </Link>
                      </>
                    )}
                  </ul>
                </li>

                {user !== null ? (
                  <li className="nav-item" onClick={handlelogout}>
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      style={{ color: 'black' }}
                    >
                      Đăng xuất
                    </Link>
                  </li>
                ) : (
                  <Link
                    to="/login"
                    className="dropdown-item"
                    onClick={refreshPage}
                  >
                    Đăng Nhập
                  </Link>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
