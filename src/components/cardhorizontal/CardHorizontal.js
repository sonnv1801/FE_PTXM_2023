import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "@mui/material/Button";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import RemoveIcon from "@mui/icons-material/Remove";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch } from "react-redux";
import { deleteCart, numberQuantity } from "../../redux/actions/product.action";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import numeral from "numeral";
import Swal from "sweetalert2";
export const CardHorizontal = (cart) => {
  const dispatch = useDispatch();
  const [cartCombo, setCartCombo] = useState([]);
  const [carts, setCarts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalAmountCarts, setTotalAmountCarts] = useState(0);
  const user = JSON.parse(localStorage.getItem("token"));
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const storedCartCombo = localStorage.getItem("orderData");
    if (storedCartCombo) {
      const parsedCartCombo = JSON.parse(storedCartCombo);

      // Tính tổng tiền ban đầu từ các sản phẩm ban đầu
      const initialTotalAmount = parsedCartCombo.reduce(
        (total, item) => total + item.quantityCombo * item.subtotal,
        0
      );

      setCartCombo(parsedCartCombo);
      setTotalAmount(initialTotalAmount);
    }
  }, []);

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const storedCartCombo = localStorage.getItem("carts");
    if (storedCartCombo) {
      const parsedCartCombo = JSON.parse(storedCartCombo);

      // Tính tổng tiền ban đầu từ các sản phẩm ban đầu
      const initialTotalAmount = parsedCartCombo.reduce(
        (total, item) => total + item.newPrice * item.quantity_cart,
        0
      );

      setCarts(parsedCartCombo);
      setTotalAmountCarts(initialTotalAmount);
    }
  }, []);

  function refreshPage() {
    setTimeout(() => {
      window.location.reload(false);
    }, 100);
  }

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
      setTotalAmountCarts(newTotalAmount);

      // Lưu dữ liệu đã được cập nhật vào localStorage
      localStorage.setItem("carts", JSON.stringify(updatedCartCombo));

      return updatedCartCombo;
    });
    setTimeout(() => {
      refreshPage();
    }, 500);
  };

  const handleQuantityChange = (comboIndex, increment) => {
    setCartCombo((prevCartCombo) => {
      const updatedCartCombo = [...prevCartCombo];
      const combo = updatedCartCombo[comboIndex];

      if (!combo.quantityCombo) {
        combo.quantityCombo = 0;
      }

      if (increment) {
        // Tăng số lượng combo lên 1
        combo.quantityCombo += 1;
      } else {
        // Giảm số lượng combo đi 1, nhưng không nhỏ hơn 0
        combo.quantityCombo = Math.max(0, combo.quantityCombo - 1);
      }

      // Cập nhật tổng tiền của combo dựa trên số lượng và giá tiền mới
      combo.totalPrice = combo.quantityCombo * combo.subtotal;

      // Cập nhật tổng tiền khi thay đổi số lượng
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

  const handleQuantityChangeCarts = (itemIndex, increment) => {
    setCarts((prevCart) => {
      const updatedCart = [...prevCart];
      const item = updatedCart[itemIndex];

      if (!item.quantity_cart) {
        item.quantity_cart = 0;
      }

      if (increment) {
        // Tăng số lượng sản phẩm lên 1
        item.quantity_cart += 1;
      } else {
        // Giảm số lượng sản phẩm đi 1, nhưng không nhỏ hơn 0
        item.quantity_cart = Math.max(0, item.quantity_cart - 1);
      }

      // Cập nhật tổng tiền của sản phẩm dựa trên số lượng và giá tiền mới
      item.totalPrice = item.quantity_cart * item.newPrice;

      // Cập nhật tổng tiền khi thay đổi số lượng
      const newTotalAmount = updatedCart.reduce(
        (total, item) => total + item.quantity_cart * item.newPrice,
        0
      );
      setTotalAmountCarts(newTotalAmount);

      // Lưu dữ liệu đã được cập nhật vào localStorage
      localStorage.setItem("carts", JSON.stringify(updatedCart));

      return updatedCart;
    });
    setTimeout(() => {
      refreshPage();
    }, 500);
  };

  // Tính tổng tiền cuối cùng từ cả hai nguồn dữ liệu
  const grandTotal = totalAmountCarts + totalAmount;

  const renderQuantity = () => {
    const comboQuantity = cartCombo.reduce((sum, item) => {
      return (sum += item.quantityCombo);
    }, 0);

    const productQuantity = carts?.reduce((sum, item) => {
      return (sum += item.quantity_cart);
    }, 0);

    return comboQuantity + productQuantity;
  };
  const navigate = useNavigate();

  // Hàm xử lý khi người dùng nhấp vào nút "Mua hàng"

  const [data, setData] = useState({
    email: user?.email,
    fullname: user?.fullname,
    phone: "",
    address: "",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState(
    "Thanh toán khi nhận hàng"
  );
  console.log(paymentMethod, "paymentMethod");
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleChange = (name) => (e) => {
    const value = name === "image" ? e.target.files[0] : e.target.value;
    setData({ ...data, [name]: value });
  };
  async function handlePurchase() {
    if (
      data.fullname !== "" &&
      data.phone !== "" &&
      data.address !== "" &&
      data.email !== "" &&
      paymentMethod
    ) {
      // Lấy dữ liệu từ localStorage
      const storedCarts = localStorage.getItem("carts");
      const storedOrderData = localStorage.getItem("orderData");
      const storedToken = localStorage.getItem("token");

      // Kiểm tra xem dữ liệu có tồn tại hay không
      if (storedCarts || (storedOrderData && storedToken)) {
        // Parse dữ liệu thành đối tượng JSON
        const carts = storedCarts ? JSON.parse(storedCarts) : [];
        const orderData = storedOrderData ? JSON.parse(storedOrderData) : [];
        const user = JSON.parse(storedToken);

        // Tạo một đối tượng mới để chứa các đơn hàng và tổng tiền
        const order = {
          products: [],
          combos: [],
          totalOrderPrice: 0,
          customerId: user?._id,
          email: data.email,
          name: data.fullname,
          phoneNumber: data.phone,
          address: data.address,
          note: data.notes,
        };

        // Thêm dữ liệu từ carts vào order
        order.products = carts.map((cart) => ({
          id: cart.id,
          code: cart.code,
          title: cart.title,
          image: cart.image,
          newPrice: cart.newPrice,
          quantity_cart: cart.quantity_cart,
        }));

        // Thêm dữ liệu từ orderData vào order
        order.combos = orderData.map((data) => ({
          _id: data._id,
          quantityCombo: data.quantityCombo,
          image: data.image,
          comboName: data.comboName,
          quantity: data.quantity,
          products: data.products.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
            name: product.name,
            productCode: product.productCode,
            price: product.price,
            image: product.image,
            title: product.title,
            total: product.total,
          })),
          subtotal: data.subtotal,
          totalPrice: data.totalPrice,
        }));

        // Tính tổng tiền của đơn hàng
        let totalOrderPrice = 0;

        totalOrderPrice = order.combos.reduce(
          (total, combo) =>
            total +
            (combo.totalPrice ||
              combo.products.reduce(
                (subtotal, product) =>
                  subtotal + product.price * product.quantity,
                0
              )),
          0
        );
        totalOrderPrice += order.products.reduce(
          (total, product) => total + product.newPrice * product.quantity_cart,
          0
        );

        // Cập nhật tổng tiền của đơn hàng
        order.totalOrderPrice = totalOrderPrice;

        try {
          // Giảm số lượng combo
          for (const combo of order.combos) {
            const comboResponse = await axios.put(
              `http://localhost:8000/v1/combo/combo/${combo._id}/reduce`,
              {
                quantityCombo: combo.quantityCombo,
                products: combo.products.map((product) => ({
                  productId: product.productId,
                  quantity: product.quantity,
                })),
              }
            );

            console.log(
              "Số lượng combo đã giảm thành công:",
              comboResponse.data
            );
          }

          // Tăng số lượng sản phẩm đã mua
          for (const product of order.products) {
            const productResponse = await axios.post(
              `http://localhost:8000/v1/order/products/buy/${product.id}`,
              {
                quantity: product.quantity_cart,
              }
            );

            console.log(
              "Số lượng sản phẩm đã mua đã được cập nhật:",
              productResponse.data
            );
          }

          // Gửi yêu cầu POST đến backend server với đơn hàng đã được map
          const response = await axios.post(
            "http://localhost:8000/v1/ordercombo",
            order
          );

          // Xử lý kết quả trả về từ backend (nếu cần)
          console.log("Yêu cầu POST thành công:", response.data);

          // Xóa dữ liệu trong localStorage sau khi đã thành công
          localStorage.removeItem("carts");
          localStorage.removeItem("orderData");

          // Hiển thị thông báo hoặc chuyển hướng người dùng tới trang thành công
          toast.success("Cảm ơn bạn đã mua hàng!", {
            position: toast.POSITION.TOP_CENTER,
          });
          navigate("/history");
          // window.location.href = "/thanh-cong";
          setTimeout(() => {
            refreshPage();
          }, 500);
        } catch (error) {
          // Xử lý lỗi (nếu có)
          console.error("Có lỗi xảy ra khi mua hàng:", error);
          toast.error("Có lỗi xảy ra khi mua hàng!", {
            position: toast.POSITION.TOP_CENTER,
          });
          // window.location.href = "/loi";
        }
      } else {
        // Hiển thị thông báo lỗi hoặc chuyển hướng người dùng tới trang lỗi
        toast.error("Không tìm thấy đơn hàng, mua thêm nha", {
          position: toast.POSITION.TOP_CENTER,
        });
        // window.location.href = "/loi";
      }
    } else {
      toast.warn("Nhập đầy đủ thông tin để thanh toán", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }

  const [showProducts, setShowProducts] = useState([]);

  const handleToggleProducts = (index) => {
    setShowProducts((prevShowProducts) => {
      const updatedShowProducts = [...prevShowProducts];
      updatedShowProducts[index] = !updatedShowProducts[index];
      return updatedShowProducts;
    });
  };
  const handleRemoveProductFromOrder = (comboIndex, productIndex) => {
    setCartCombo((prevCartCombo) => {
      const updatedCartCombo = [...prevCartCombo];
      const combo = updatedCartCombo[comboIndex];

      // Kiểm tra nếu chỉ còn 1 sản phẩm trong combo, không cho phép xóa
      if (combo.products.length === 1) {
        Swal.fire("Không thể xóa sản phẩm cuối cùng trong combo!", "error");
        return updatedCartCombo;
      }

      // Xóa sản phẩm khỏi combo
      combo.products = combo.products
        .slice(0, productIndex)
        .concat(combo.products.slice(productIndex + 1));

      // Tính lại tổng tiền và tổng giá cho combo
      combo.subtotal = combo.products.reduce(
        (subtotal, product) => subtotal + product.price * product.quantity,
        0
      );
      combo.totalPrice = combo.subtotal * combo.quantityCombo;

      // Cập nhật tổng tiền khi xóa sản phẩm
      const newTotalAmount = updatedCartCombo.reduce(
        (total, item) => total + item.totalPrice,
        0
      );
      setTotalAmount(newTotalAmount);

      // Lưu dữ liệu đã được cập nhật vào localStorage
      localStorage.setItem("orderData", JSON.stringify(updatedCartCombo));

      return updatedCartCombo;
    });
  };

  return (
    <div className="row">
      <div className="col-6">
        <p className="carts">Giỏ hàng</p>
        <div className="card-horizontal-container">
          <p
            style={{
              textAlign: "center",
              padding: "0 1rem",
              marginBottom: "1rem",
            }}
          >
            Số lượng có trong Giỏ {renderQuantity()}
          </p>
          <div className="body-card">
            {carts?.map((item, index) => (
              <div
                className="row"
                style={{ textAlign: "center", marginBotto: "1rem" }}
                key={index}
              >
                <div className="col-2">
                  <div className="img-card">
                    <img src={item?.image} alt={item?.title} />
                    <CloseIcon
                      className="close-prd"
                      onClick={() => handleRemoveProductCarts(index)}
                    />
                  </div>
                </div>
                <div className="col-4">
                  <Link to={`/shop/product-dt/${item.id}`} key={item.id}>
                    <div>{item.title}</div>
                  </Link>

                  <span>{item?.code} </span>
                </div>
                <div className="col-3">
                  <div className="action-prd-dt">
                    <div className="btn-quantity">
                      <IconButton
                        aria-label="delete"
                        size="large"
                        className="hover-card"
                        onClick={() => handleQuantityChangeCarts(index, false)}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <span>{item?.quantity_cart} </span>
                      <IconButton
                        aria-label="delete"
                        size="large"
                        className="hover-card"
                        onClick={() => handleQuantityChangeCarts(index, true)}
                      >
                        <AddIcon />
                      </IconButton>
                    </div>
                  </div>
                </div>
                <div className="col-3">
                  <b>
                    {" "}
                    {item.quantity_cart === 1
                      ? `${numeral(item.newPrice).format("0,0")}đ`
                      : `${numeral(item.newPrice * item.quantity_cart).format(
                          "0,0"
                        )}đ`}
                  </b>
                </div>
                <hr style={{ margin: "1rem 0" }} />
              </div>
            ))}
          </div>

          <div className="body-card">
            {cartCombo?.map((item, index) => (
              <>
                <div
                  className="row"
                  style={{ textAlign: "center", marginBotto: "1rem" }}
                  key={index}
                >
                  <div className="col-2">
                    <div className="img-card">
                      <img src={item?.image} alt={item?.comboName} />
                      <CloseIcon
                        className="close-prd"
                        onClick={() => handleRemoveProduct(index)}
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div>{item?.comboName} </div>
                    <span>Số sản phẩm {item?.quantity} </span>
                  </div>
                  <div className="col-3">
                    <div className="action-prd-dt">
                      <div className="btn-quantity">
                        <IconButton
                          aria-label="delete"
                          size="large"
                          className="hover-card"
                          onClick={() => handleQuantityChange(index, false)}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <span>{item?.quantityCombo} </span>
                        <IconButton
                          aria-label="delete"
                          size="large"
                          className="hover-card"
                          onClick={() => handleQuantityChange(index, true)}
                        >
                          <AddIcon />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                  <div className="col-3">
                    <b>
                      <b>
                        <b>
                          {item.quantityCombo === 1
                            ? `${numeral(item.subtotal).format("0,0")}đ`
                            : `${numeral(
                                item.subtotal * item.quantityCombo
                              ).format("0,0")}đ`}
                        </b>
                      </b>
                    </b>
                  </div>
                  <hr style={{ margin: "1rem 0" }} />
                </div>

                {showProducts[index] &&
                  // Hiển thị sản phẩm khi showProducts[index] là true
                  item.products.map((product, productIndex) => (
                    <div
                      className="row"
                      style={{
                        textAlign: "center",
                        marginBotto: "1rem",
                        padding: "1rem",
                      }}
                      key={productIndex}
                    >
                      {/* chỗ này viết xóa từng sản phẩm theo order */}
                      <div className="col-2">
                        <div className="img-card">
                          <img src={product?.image} alt={item?.comboName} />
                          <CloseIcon
                            className="close-prd"
                            onClick={() =>
                              handleRemoveProductFromOrder(index, productIndex)
                            }
                          />
                        </div>
                      </div>
                      <div className="col-4">
                        <div>{product?.name}</div>
                        <span>Số sản phẩm {product?.quantity}</span>
                      </div>
                      <div className="col-3">
                        Giá: {numeral(product?.price).format("0,0")}đ
                      </div>
                      <div className="col-3">
                        Tổng: {numeral(product?.total).format("0,0")}đ
                      </div>
                      <hr style={{ margin: "1rem 0" }} />
                    </div>
                  ))}

                <div style={{ display: "flex", justifyContent: "right" }}>
                  <button
                    onClick={() => handleToggleProducts(index)}
                    id="btn-htt"
                  >
                    {showProducts[index]
                      ? "Ẩn sản phẩm"
                      : "Hiển thị sản phẩm combo"}
                  </button>
                </div>
              </>
            ))}
          </div>

          <div className="total-prd-card">
            <div className="row">
              <div className="col-6"></div>
              <div className="col-6">
                <div className="sub-total">
                  <p>Tạm tính Tiền Máy PHOTOCOPY: </p>
                  <b>{`${numeral(totalAmountCarts).format("0,0")}đ`}</b>
                </div>
                <div className="sub-total">
                  <p>Tạm tính Tiền Combo: </p>
                  <b>{`${numeral(totalAmount).format("0,0")}đ`}</b>
                </div>
                <div className="sub-total">
                  <p>Tổng: </p>
                  <b>{`${numeral(grandTotal).format("0,0")}đ`}</b>
                </div>
              </div>
            </div>
          </div>
          <div className="action-prd-dt-btn-card">
            <Link to="/">
              <Button
                variant="outlined"
                endIcon={<ArrowRightIcon />}
                // onClick={handlePurchase}
              >
                Tiếp tục mua hàng
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="col-6">
        <div className="payment-container">
          <div className="body-container-payment">
            <h1>Thông tin thanh toán</h1>
            {user === null ? (
              <div className="account-payment">
                <p>Bạn có tài khoản chưa? </p>
                <Link to="/login">
                  <Button variant="contained" endIcon={<ArrowRightIcon />}>
                    Đăng nhập ngay?
                  </Button>
                </Link>
              </div>
            ) : (
              ""
            )}

            <div className="infomation-users">
              <Form.Group className="formgroup-body">
                <Form.Label>Email: </Form.Label>
                <Form.Control
                  type="email"
                  required
                  value={data.email}
                  onChange={handleChange("email")}
                />
                <div className="row">
                  <div className="col-6">
                    <Form.Label>Họ và tên:* </Form.Label>
                    <Form.Control
                      type="text"
                      required
                      value={data.fullname}
                      onChange={handleChange("fullname")}
                    />
                  </div>
                  <div className="col-6">
                    <Form.Label>Số điện thoại:* </Form.Label>
                    <Form.Control
                      type="number"
                      required
                      onChange={handleChange("phone")}
                    />
                  </div>
                </div>

                <Form.Label>Địa chỉ:* </Form.Label>
                <Form.Control
                  type="text"
                  required
                  onChange={handleChange("address")}
                />
                <Form.Label>Ghi Chú: </Form.Label>
                <FloatingLabel controlId="floatingTextarea2" label="Ghi chú">
                  <Form.Control
                    as="textarea"
                    placeholder="Leave a comment here"
                    style={{ height: "100px" }}
                    onChange={handleChange("notes")}
                  />
                </FloatingLabel>
              </Form.Group>
            </div>
            <hr />
            <div className="payments-money">
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">
                  Hình thức thanh toán
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                  value={paymentMethod}
                  onChange={handlePaymentMethodChange}
                >
                  <FormControlLabel
                    value="Thanh toán khi nhận hàng"
                    control={<Radio />}
                    label="Thanh toán khi nhận hàng"
                  />
                  <FormControlLabel
                    value="Chuyển khoản ngân hàng"
                    control={<Radio />}
                    label="Chuyển khoản ngân hàng"
                  />
                </RadioGroup>
              </FormControl>
            </div>

            <hr />
            <div className="payments">
              {user === null ? (
                <Link to="/login">
                  <Button variant="contained" endIcon={<ArrowRightIcon />}>
                    Đăng nhập ngay?
                  </Button>
                </Link>
              ) : (
                <Button variant="contained" onClick={handlePurchase}>
                  Thanh toán
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
