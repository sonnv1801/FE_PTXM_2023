import { createAction } from ".";
import { userService } from "../../services";
import { LOGIN_FAILED, LOGIN_START, LOGIN_SUCCESS } from "../type/types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const loginStart = () => {
  return {
    type: LOGIN_START,
  };
};

export const loginFailed = () => {
  return {
    type: LOGIN_FAILED,
  };
};

function refreshPage() {
  setTimeout(() => {
    window.location.reload(false);
  }, 1000);
}

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  userService
    .Login(user)
    .then((res) => {
      dispatch(createAction(LOGIN_SUCCESS, res.data));
      localStorage.setItem("token", JSON.stringify(res.data));
      console.log("token", user);
      navigate("/");
      toast.success("Đăng nhập thành công!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      refreshPage();
    })
    .catch((err) => {
      console.log(err);
      dispatch(loginFailed());
    });
};
