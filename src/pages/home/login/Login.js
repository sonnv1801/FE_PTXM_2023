import React from "react";
import "./style.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../redux/actions/user.action";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const messerr = useSelector((state) => state.defaultReducer.login.error);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(messerr);
  const handleLogin = (e) => {
    e.preventDefault();
    if (username !== "" && password !== "") {
      const newUser = {
        username: username,
        password: password,
      };
      loginUser(newUser, dispatch, navigate);
    } else {
      toast.warning("Nhập đầy đủ Username và mật khẩu", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <>
      <div className="main-login sm-main-login">
        <div style={{ padding: "1rem" }}>
          <form
            className="login sm-login"
            action="#"
            id="form-1"
            onSubmit={handleLogin}
          >
            <div style={{ padding: "1rem" }}>
              <p style={{ color: "red", textAlign: "center" }}>
                {messerr === false
                  ? ``
                  : `Vui Lòng kiểm tra lại Username Và Mật khẩu!`}
              </p>
              <div className="title" style={{ marginLeft: "0" }}>
                Đăng Nhập!
              </div>
              <p className="title-input">Tên đăng nhập</p>
              <div className="input-group-h mb-3">
                <input
                  type="text"
                  for="fullname"
                  className="form-control input-form-h"
                  placeholder="Nhập tài khoản..."
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ padding: "0.5rem" }}
                />
              </div>

              <div style={{ position: "relative" }}>
                <p className="title-input">Mật khẩu</p>
                <div className="input-group-h mb-3">
                  <input
                    style={{ padding: "0.5rem" }}
                    type={showPassword ? "text" : "password"}
                    for="password"
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                    className="form-control input-form-h"
                    placeholder="Nhập mật khẩu..."
                    id="form-password"
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "26px",
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
                      <i class="fa fa-eye-slash"></i>
                    )}
                  </span>
                </div>
              </div>
              <button type="submit" className="btn btn-danger">
                ĐĂNG NHẬP
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
