import React from "react";
import "./style.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.fullname ||
      !formData.email ||
      !formData.phone ||
      !formData.username ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.warning("Vui lòng điền đầy đủ thông tin.", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.warning("Mật khẩu và xác nhận mật khẩu không trùng khớp.", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/auth/register`,
        formData
      );
      setIsDataLoaded(true);
      toast.success(`Đăng Ký Thành Công, Hãy Đăng Nhập Nào!`, {
        position: toast.POSITION.TOP_CENTER,
      });
      navigate("/login");
    } catch (error) {
      setIsSubmitting(false);
      if (error.response) {
        const { message } = error.response.data;
        toast.warning(`${message}`, {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        console.error("Error:", error.message);
      }
    }
  };
  return (
    <>
      <div className="main-register sm-main-register">
        <div style={{ padding: "1rem" }}>
          <form
            className="register sm-register"
            action="#"
            onSubmit={handleSubmit}
            id="form-1"
          >
            <div style={{ padding: "1rem" }}>
              <div className="title" style={{ marginLeft: "0" }}>
                Đăng Ký!
              </div>
              <div className="row">
                <div className="col-xl-6 col-sm-12">
                  <p className="title-input">Họ Và Tên</p>
                  <div className="input-group-h mb-3">
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      className="form-control input-form-h"
                      placeholder="Nhập tên bạn..."
                      style={{ padding: "0.5rem" }}
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-sm-12">
                  <p className="title-input">Email</p>
                  <div className="input-group-h mb-3">
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control input-form-h"
                      placeholder="Email..."
                      style={{ padding: "0.5rem" }}
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-sm-12">
                  <p className="title-input">Điện thoại</p>
                  <div className="input-group-h mb-3">
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-control input-form-h"
                      placeholder="Nhập SDT..."
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      style={{ padding: "0.5rem" }}
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-sm-12">
                  <p className="title-input">Tên đăng nhập</p>
                  <div className="input-group-h mb-3">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="form-control input-form-h"
                      placeholder="Nhập tên..."
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      style={{ padding: "0.5rem" }}
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-sm-12">
                  <div style={{ position: "relative" }}>
                    <p className="title-input">Mật khẩu</p>
                    <div className="input-group-h mb-3">
                      <input
                        style={{ padding: "0.5rem" }}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control input-form-h"
                        placeholder="***********"
                        id="form-password"
                      />
                      <span
                        style={{
                          position: "absolute",
                          top: "26px",
                          right: "8px",
                          margin: "0",
                          background: "#ffffff00",
                          cursor: "pointer",
                        }}
                        className="input-group-h-text"
                        id="basic-addon1"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <i className="fa fa-eye"></i>
                        ) : (
                          <i className="fa fa-eye-slash"></i>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 col-sm-12">
                  <div style={{ position: "relative" }}>
                    <p className="title-input">Nhập lại mật khẩu</p>
                    <div className="input-group-h mb-3">
                      <input
                        style={{ padding: "0.5rem" }}
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="form-control input-form-h"
                        placeholder="***********"
                        id="form-password"
                      />
                      <span
                        style={{
                          position: "absolute",
                          top: "26px",
                          right: "8px",
                          margin: "0",
                          background: "#ffffff00",
                          cursor: "pointer",
                        }}
                        className="input-group-h-text"
                        id="basic-addon1"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? (
                          <i className="fa fa-eye"></i>
                        ) : (
                          <i className="fa fa-eye-slash"></i>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="btn-footer">
                <Link to="/login">
                  <p className="regiter-no">Bạn đã có tài khoản? ĐĂNG NHẬP</p>
                </Link>
                <Button variant="contained" type="submit">
                  {isSubmitting && !isDataLoaded ? (
                    <>Vui lòng chờ...</>
                  ) : (
                    <> ĐĂNG KÝ</>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
