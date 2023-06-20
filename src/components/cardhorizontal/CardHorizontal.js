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
export const CardHorizontal = (cart) => {
  const dispatch = useDispatch();
  const [cartCombo, setCartCombo] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const user = JSON.parse(localStorage.getItem("token"));

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
  };

  const renderAmount = () => {
    return totalAmount; // Hiển thị tổng tiền với 2 chữ số thập phân
  };

  let subTotal = 0;
  cart?.cart?.forEach((item) => {
    subTotal += item.newPrice * item.quantity_cart;
  });

  const renderAmountPT = () => {
    return cart?.cart?.reduce((total, item) => {
      return (total += item.newPrice * item.quantity_cart);
    }, 0);
  };
  // Tính tổng tiền cuối cùng từ cả hai nguồn dữ liệu
  const grandTotal = subTotal + totalAmount;

  const renderQuantity = () => {
    const comboQuantity = cartCombo.reduce((sum, item) => {
      return (sum += item.quantityCombo);
    }, 0);

    const productQuantity = cart?.cart?.reduce((sum, item) => {
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
  function handlePurchase() {
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

        // Tính tổng tiền của đơn hàng
        let totalOrderPrice = 0;

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
          status: cart.status,
          title: cart.title,
          image: cart.image,
          newPrice: cart.newPrice,
          quantity_cart: cart.quantity_cart,
        }));

        // Thêm dữ liệu từ orderData vào order
        order.combos = orderData.map((data) => ({
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

        // Gửi yêu cầu POST đến backend server với đơn hàng đã được map
        axios
          .post("https://phutungxemay.onrender.com/v1/ordercombo", order)
          .then((response) => {
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
          })
          .catch((error) => {
            // Xử lý lỗi (nếu có)
            console.error("Có lỗi xảy ra khi gửi yêu cầu POST:", error);
            toast.error("Có lỗi xảy ra khi mua hàng!", {
              position: toast.POSITION.TOP_CENTER,
            });
            // window.location.href = "/loi";
          });
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
            {cart?.cart?.map((item, index) => (
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
                      onClick={() => {
                        dispatch(deleteCart(item));
                      }}
                    />
                  </div>
                </div>
                <div className="col-4">
                  <div>{item?.title} </div>
                  <span>{item?.code} </span>
                </div>
                <div className="col-3">
                  <div className="action-prd-dt">
                    <div className="btn-quantity">
                      <IconButton
                        aria-label="delete"
                        size="large"
                        className="hover-card"
                        onClick={() => {
                          dispatch(numberQuantity(item, false));
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <span>{item?.quantity_cart} </span>
                      <IconButton
                        aria-label="delete"
                        size="large"
                        className="hover-card"
                        onClick={() => {
                          dispatch(numberQuantity(item, true));
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </div>
                  </div>
                </div>
                <div className="col-3">
                  <b>
                    {`${numeral(item.newPrice * item.quantity_cart).format(
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
                          : `${numeral(item.totalPrice).format("0,0")}đ`}
                      </b>
                    </b>
                  </b>
                </div>
                <hr style={{ margin: "1rem 0" }} />
              </div>
            ))}
          </div>

          <div className="total-prd-card">
            <div className="row">
              <div className="col-6"></div>
              <div className="col-6">
                <div className="sub-total">
                  <p>Tạm tính Tiền Phụ Tùng: </p>
                  <b>{`${numeral(renderAmountPT()).format("0,0")}đ`}</b>
                </div>
                <div className="sub-total">
                  <p>Tạm tính Tiền Combo: </p>
                  <b>{`${numeral(renderAmount()).format("0,0")}đ`}</b>
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
