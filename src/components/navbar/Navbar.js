import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Dropdown from "react-bootstrap/Dropdown";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { getAllTypeProduct } from "../../redux/actions/type.action";
import { deleteCart } from "../../redux/actions/product.action";
import { getAllTypeProductCombo } from "../../redux/actions/typecombo.action";
import { getSupplier } from "../../redux/actions/supplier.action";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import numeral from "numeral";
const Navbar = () => {
  const dispatch = useDispatch();
  const listTypePhuTung = useSelector((state) => state.defaultReducer.listType);
  const listSupplier = useSelector(
    (state) => state.defaultReducer.listSupplier
  );
  const [cartCombo, setCartCombo] = useState([]);
  const [carts, setCarts] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const storedCartCombo = localStorage.getItem("orderData");
    if (storedCartCombo) {
      const parsedCartCombo = JSON.parse(storedCartCombo);
      setCartCombo(parsedCartCombo);
    }
  }, []);
  useEffect(() => {
    const storedCartCombo = localStorage.getItem("carts");
    if (storedCartCombo) {
      const parsedCartCombo = JSON.parse(storedCartCombo);
      if (Array.isArray(parsedCartCombo)) {
        setCarts(parsedCartCombo);
      } else {
        setCarts([]);
      }
    }
  }, []);

  console.log(carts, "carts");

  const listTypeCombo = useSelector(
    (state) => state.defaultReducer.listTypeComBo
  );

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  function refreshPage() {
    setTimeout(() => {
      window.location.reload(false);
    }, 100);
  }
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const user = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();
  const handlelogout = () => {
    localStorage.removeItem("token");

    navigate("/");
    toast.success("Đăng xuất thành công! Hẹn gặp lại", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };
  useEffect(() => {
    dispatch(getAllTypeProduct());
  }, []);
  useEffect(() => {
    dispatch(getAllTypeProductCombo());
  }, []);
  useEffect(() => {
    dispatch(getSupplier());
  }, []);

  console.log(listSupplier, "listSupplier");
  // const cart = JSON.parse(localStorage.getItem("carts"));

  const renderQuantity = () => {
    const comboQuantity = cartCombo.reduce((sum, item) => {
      return (sum += item.quantityCombo);
    }, 0);

    const productQuantity = carts?.reduce((sum, item) => {
      return (sum += item.quantity_cart);
    }, 0);

    return comboQuantity + productQuantity;
  };
  const [totalAmount, setTotalAmount] = useState(0);
  const handleRemoveProduct = (itemIndex) => {
    setCartCombo((prevCartCombo) => {
      const updatedCartCombo = prevCartCombo.filter(
        (item, index) => index !== itemIndex
      );

      // Cập nhật tổng tiền khi xóa sản phẩm
      const newTotalAmount = updatedCartCombo.reduce(
        (total, item) => total + item.quantityCombo * item.subtotal,
        0
      );
      setTotalAmount(newTotalAmount);

      // Lưu dữ liệu đã được cập nhật vào localStorage
      localStorage.setItem("orderData", JSON.stringify(updatedCartCombo));

      return updatedCartCombo;
    });
    setTimeout(() => {
      refreshPage();
    }, 500);
  };

  const handleRemoveProductCarts = (itemIndex) => {
    setCarts((prevCartCombo) => {
      const updatedCartCombo = prevCartCombo.filter(
        (item, index) => index !== itemIndex
      );

      // Cập nhật tổng tiền khi xóa sản phẩm
      const newTotalAmount = updatedCartCombo.reduce(
        (total, item) => total + item.quantity_cart * item.newPrice,
        0
      );

      setCarts(updatedCartCombo);

      // Lưu dữ liệu đã được cập nhật vào localStorage
      localStorage.setItem("carts", JSON.stringify(updatedCartCombo));

      return updatedCartCombo;
    });
    setTimeout(() => {
      refreshPage();
    }, 500);
  };

  return (
    <>
      {/* {user?.role === false ? ( */}
      <>
        <div style={{ marginTop: "8rem" }}></div>
        <nav className="nav-container">
          <ul>
            <li>
              <Link to="/" title="Trang chủ">
                Trang chủ
              </Link>
            </li>
            <li>
              <a href="#" title="Phụ tùng xe máy">
                Phụ Tùng Xe máy <ArrowDropDownIcon />
              </a>
              <div className="sub-menu-lv2">
                <div className="row">
                  {listTypePhuTung.map((item, index) => (
                    <div className="col-4">
                      <Link to={`/shop/${item.name}`} onClick={refreshPage}>
                        <span>{item.name}</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </li>
            <li>
              <a href="#" title="Phụ tùng xe máy">
                Combo <ArrowDropDownIcon />
              </a>
              <div className="sub-menu-lv2">
                <div className="row">
                  {listTypeCombo.map((item, index) => (
                    <div className="col-4">
                      <Link
                        to={`/shopcombo/${item.link}`}
                        onClick={refreshPage}
                      >
                        <span>{item.name}</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </li>
            <p
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Chọn nhà cung cấp
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {listSupplier?.map((item, index) => (
                    <Link to={`/shopsupplier/${item.link}`}>
                      <Dropdown.Item href="#/action-1">
                        {item?.name}
                      </Dropdown.Item>
                    </Link>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </p>
          </ul>
          <ul>
            <li>
              <a href="#" title="Giỏ hàng" id="cart-nav">
                <ShoppingCartOutlinedIcon /> {renderQuantity()}
              </a>
              <div className="sub-menu-lv3">
                <h1 style={{ textAlign: "center", margin: "1rem" }}>
                  Giỏ hàng
                </h1>
                <div>
                  {carts.length || cartCombo.length > 0 ? (
                    <>
                      {carts?.length === 0 ? (
                        ""
                      ) : (
                        <>
                          <div className="row" style={{ padding: "1rem" }}>
                            {carts?.map((item, index) => (
                              <>
                                <div className="col-2">
                                  <img src={item?.image} alt={item?.title} />
                                  <CloseIcon
                                    className="close-prd"
                                    onClick={() =>
                                      handleRemoveProductCarts(index)
                                    }
                                  />
                                </div>
                                <div className="col-6">
                                  <p>
                                    <b
                                      style={{
                                        margin: "1rem",
                                        fontSize: "0.6rem",
                                      }}
                                    >
                                      X{item?.quantity_cart}
                                    </b>
                                    {item?.title}
                                  </p>
                                  <b>{item?.code}</b>
                                </div>
                                <div className="col-4">
                                  <h6>{item?.status}</h6>
                                  <h6>{`${numeral(item?.newPrice).format(
                                    "0,0"
                                  )}đ`}</h6>
                                </div>
                                <hr style={{ margin: "1rem 0" }} />
                              </>
                            ))}
                          </div>
                        </>
                      )}
                      {cartCombo?.length === 0 ? (
                        ""
                      ) : (
                        <>
                          <div className="row" style={{ padding: "1rem" }}>
                            {cartCombo.map((item, index) => (
                              <React.Fragment key={index}>
                                <div className="col-2">
                                  <img src={item.image} alt={item.comboName} />
                                  <CloseIcon
                                    className="close-prd"
                                    onClick={() => handleRemoveProduct(index)}
                                  />
                                </div>
                                <div className="col-6">
                                  <p>
                                    <b>Tên Combo</b>
                                  </p>
                                  <h6>
                                    <b> X{item.quantityCombo}</b>
                                    {item.comboName}
                                  </h6>
                                </div>
                                <div className="col-4">
                                  <h6>Còn Hàng</h6>
                                  <h6>{`${numeral(item.subtotal).format(
                                    "0,0"
                                  )}đ`}</h6>
                                </div>
                                <hr style={{ margin: "1rem 0" }} />
                              </React.Fragment>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <p className="text-center">Hiện tại chưa có sản phẩm nào</p>
                  )}
                </div>
                {carts.length || cartCombo.length > 0 ? (
                  <>
                    <div className="row">
                      {/* <div className="col-6">
                   <span>Giỏ Hàng</span>
                 </div> */}
                      {/* <div className="col-6">
                   <span>{renderAmount()}</span>
                 </div> */}
                      <div className="col-12" style={{ margin: "1rem" }}>
                        <Link to="/shop/product-dt/cart">
                          <Button
                            variant="contained"
                            endIcon={<ArrowForwardIosIcon />}
                          >
                            Thanh toán
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
            </li>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "1rem",
                justifyContent: "center",
              }}
            >
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {user === null ? (
                    <Link
                      to="/login"
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      <MenuItem>
                        <Typography textAlign="center">Đăng nhập</Typography>
                      </MenuItem>
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/history"
                        style={{ color: "black", textDecoration: "none" }}
                      >
                        <MenuItem>
                          <Typography textAlign="center">
                            Đơn hàng của bạn!
                          </Typography>
                        </MenuItem>
                      </Link>
                      <Link
                        to="/orderpage"
                        style={{ color: "black", textDecoration: "none" }}
                      >
                        <MenuItem>
                          <Typography textAlign="center">
                            Đơn hàng nhà cung cấp!
                          </Typography>
                        </MenuItem>
                      </Link>
                      <Link
                        to="/cart-supplier"
                        style={{ color: "black", textDecoration: "none" }}
                      >
                        <MenuItem>
                          <Typography textAlign="center">
                            Lên Đơn Hàng
                          </Typography>
                        </MenuItem>
                      </Link>
                      <MenuItem onClick={handlelogout}>
                        <Typography textAlign="center">Đăng xuất</Typography>
                      </MenuItem>
                    </>
                  )}
                  {user?.role === true ? (
                    <Link
                      to="/admin"
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      <MenuItem>
                        <Typography textAlign="center">Admin</Typography>
                      </MenuItem>
                    </Link>
                  ) : (
                    ""
                  )}
                </Menu>
              </Box>
            </div>
          </ul>
        </nav>
      </>
      {/* ) : ( */}
      {/* "" */}
      {/* )} */}
    </>
  );
};

export default Navbar;
