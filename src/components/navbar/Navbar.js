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
import CartEPT from "../../assets/empty-cart.png";
import Logo from "../../assets/logo1.png";
import ApprovalIcon from "@mui/icons-material/Approval";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
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
                <img src={Logo} alt="logo" style={{ width: "100px" }} />
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
            <li>
              <Link to="/contact" title="Liên Hệ">
                Liên Hệ
              </Link>
            </li>
            {/* <p
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
            </p> */}
          </ul>
          <ul>
            <li>
              <a href="#" title="Giỏ hàng" id="cart-nav">
                <ShoppingCartOutlinedIcon /> {renderQuantity()}
              </a>
              <div className="sub-menu-lv3">
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
                                        marginRight: "0.5rem",
                                        marginLeft: "0.5rem",
                                        fontSize: "0.6rem",
                                      }}
                                    >
                                      {item?.quantity_cart}X
                                    </b>
                                    {item?.title}
                                  </p>
                                  <b>{item?.code}</b>
                                </div>
                                <div className="col-4">
                                  <h6>Còn Hàng</h6>
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
                          <div className="row" style={{ padding: "0 1rem" }}>
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
                                    <b
                                      style={{
                                        marginRight: "0.5rem",
                                        marginLeft: "0.5rem",
                                        fontSize: "0.6rem",
                                      }}
                                    >
                                      {" "}
                                      X{item.quantityCombo}
                                    </b>
                                    {item.comboName}
                                  </p>
                                  <b>{item?.code}</b>
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
                    <>
                      <div style={{ padding: "25px 10rem" }}>
                        <img src={CartEPT} alt="" />
                      </div>
                      <p className="text-center">
                        Hiện tại chưa có sản phẩm nào
                      </p>
                    </>
                  )}
                </div>
                {carts.length || cartCombo.length > 0 ? (
                  <>
                    <div className="row">
                      <div className="col-12">
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
                    <Avatar alt="Remy Sharp" src={user?.image} />
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
                            <ApprovalIcon /> Đơn hàng của bạn!
                          </Typography>
                        </MenuItem>
                      </Link>
                      <MenuItem onClick={handlelogout}>
                        <Typography textAlign="center">
                          {" "}
                          <LogoutIcon /> Đăng xuất
                        </Typography>
                      </MenuItem>
                    </>
                  )}
                  {user?.role === true ? (
                    <Link
                      to="/admin"
                      style={{ color: "black", textDecoration: "none" }}
                      onClick={refreshPage}
                    >
                      <MenuItem>
                        <Typography textAlign="center">
                          {" "}
                          <AdminPanelSettingsIcon />
                          Admin
                        </Typography>
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
