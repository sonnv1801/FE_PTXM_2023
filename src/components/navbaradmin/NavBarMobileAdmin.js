import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSupplier } from "../../redux/actions/supplier.action";

export const NavBarMobileAdmin = ({ user, handlelogout, refreshPage }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSupplier());
  }, []);

  const listSupplier = useSelector(
    (state) => state.defaultReducer.listSupplier
  );

  return (
    <div id="sm-navbar-mobile">
      <div style={{ marginTop: "6.1rem" }}></div>
      <nav className="navbar bg-body-tertiary fixed-top sm-navbar-container">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand" href="#!" onClick={refreshPage}>
            Văn Sơn
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
            tabIndex="-1"
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
                Admin Phụ Tùng Xe Máy Văn Sơn
              </Link>
              <i
                className=" btn-close navbar-toggler-icon navbar-toggler"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></i>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                {user?.role === true ? (
                  <>
                    <Link
                      to="/"
                      style={{ margin: "1rem 0", fontWeight: "bold" }}
                    >
                      Quản lý Admin
                    </Link>
                    <li className="nav-item dropdown">
                      <p
                        className="nav-link dropdown-toggle"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{ color: "black" }}
                      >
                        Quản Lý Phụ Tùng
                      </p>
                      <ul className="dropdown-menu">
                        <li>
                          <Link
                            to="/list-types"
                            className="dropdown-item"
                            onClick={refreshPage}
                          >
                            Loại Phụ Tùng
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/list-products-admin"
                            className="dropdown-item"
                            onClick={refreshPage}
                          >
                            Sản Phẩm Phụ Tùng
                          </Link>
                        </li>
                      </ul>
                    </li>

                    <li className="nav-item dropdown">
                      <p
                        className="nav-link dropdown-toggle"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{ color: "black" }}
                      >
                        Quản Lý ComBo
                      </p>
                      <ul className="dropdown-menu">
                        <li>
                          <Link
                            to="/list-combos"
                            className="dropdown-item"
                            onClick={refreshPage}
                          >
                            Loại Combo
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/list-products-combos-admin"
                            className="dropdown-item"
                            onClick={refreshPage}
                          >
                            Sản Phẩm Combo
                          </Link>
                        </li>
                      </ul>
                    </li>

                    <li className="nav-item dropdown">
                      <p
                        className="nav-link dropdown-toggle"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{ color: "black" }}
                      >
                        Quản Lý Đơn Hàng
                      </p>
                      <ul className="dropdown-menu">
                        <li>
                          <Link
                            to="/order-customer"
                            className="dropdown-item"
                            onClick={refreshPage}
                          >
                            Đơn Hàng Của Phụ Tùng & Combo
                          </Link>
                        </li>
                      </ul>
                    </li>

                    <li className="nav-item dropdown">
                      <p
                        className="nav-link dropdown-toggle"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{ color: "black" }}
                      >
                        Quản Lý Nhà Cung Cấp
                      </p>
                      <ul className="dropdown-menu">
                        <li>
                          <Link
                            to="/delivery"
                            className="dropdown-item"
                            onClick={refreshPage}
                          >
                            Đơn Hàng Của Khách
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/types-supplier"
                            className="dropdown-item"
                            onClick={refreshPage}
                          >
                            Nhà Cung Cấp
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/prducts-supplier"
                            className="dropdown-item"
                            onClick={refreshPage}
                          >
                            Sản Phẩm Nhà Cung Cấp
                          </Link>
                        </li>
                      </ul>
                    </li>

                    <li className="nav-item dropdown">
                      <p
                        className="nav-link dropdown-toggle"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{ color: "black" }}
                      >
                        Mua Hàng Từ Nhà Cung Cấp
                      </p>
                      <ul className="dropdown-menu">
                        {listSupplier?.map((item) => (
                          <li key={item._id}>
                            <Link
                              to={`/shopsupplier/${item._id}`}
                              className="dropdown-item"
                              onClick={refreshPage}
                            >
                              {item?.name}
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
                        style={{ color: "black" }}
                      >
                        Quản Lý Đơn Hàng Cung Cấp Của Tôi
                      </p>
                      <ul className="dropdown-menu">
                        <li>
                          <Link
                            to="/orderpage"
                            className="dropdown-item"
                            onClick={refreshPage}
                          >
                            Đơn Hàng Đã Đặt
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/cart-supplier"
                            className="dropdown-item"
                            onClick={refreshPage}
                          >
                            Lên Đơn
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/statistics"
                            className="dropdown-item"
                            onClick={refreshPage}
                          >
                            Thống Kê
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </>
                ) : (
                  ""
                )}
                {user !== null ? (
                  <li className="nav-item" onClick={handlelogout}>
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      style={{ color: "black" }}
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
