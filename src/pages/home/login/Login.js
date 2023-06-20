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
      <div className="main">
        <form className="login" action="#" id="form-1" onSubmit={handleLogin}>
          <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
            {messerr === false
              ? ``
              : `Vui Lòng kiểm tra lại Username Và Mật khẩu!`}
          </p>

          <div className="title">Wellcome!</div>
          <p className="title-input">Tên đăng nhập</p>
          <div className="input-group mb-3">
            <input
              type="text"
              for="fullname"
              className="form-control input-form"
              placeholder="Nhập vào nè!"
              aria-label="Username"
              aria-describedby="basic-addon1"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p className="title-input">Mật khẩu</p>
          <div className="input-group mb-3">
            <input
              type={showPassword ? "text" : "password"}
              for="password"
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              className="form-control input-form"
              placeholder="Nhập mật khẩu bạn ơi!"
              id="form-password"
            />
            <span
              className="input-group-text"
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
          <button type="submit" className="btn btn-danger">
            ĐĂNG NHẬP
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
