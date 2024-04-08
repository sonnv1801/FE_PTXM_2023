import { createAction } from ".";
import Swal from "sweetalert2";
import { ordersService } from "../../services";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  DELETE_PRODUCT_TO_ORDERS,
  FETCH_PRODUCTS_TO_ORDERS,
  START_LOADING,
  STOP_LOADING,
  UPDATE_PRODUCT_TO_ORDERS,
} from "../type/types";

export const startLoading = () => {
  return {
    type: START_LOADING,
  };
};

export const stopLoading = () => {
  return {
    type: STOP_LOADING,
  };
};

export const getAllProToOrders = (page) => {
  return (dispatch) => {
    dispatch(startLoading());
    ordersService
      .getAllProductToOrder(page)
      .then((res) => {
        dispatch(createAction(FETCH_PRODUCTS_TO_ORDERS, res.data));
        dispatch(stopLoading());
      })
      .catch((err) => {
        console.log(err);
        dispatch(stopLoading());
      });
  };
};

export const updateProductoOrder = (id, item, navigate) => {
  return (dispatch) => {
    ordersService
      .updateProductoOrders(id, item, navigate)
      .then((res) => {
        dispatch(createAction(UPDATE_PRODUCT_TO_ORDERS, res.data));
        dispatch(getAllProToOrders());
        toast.success("Sửa sản phẩm thành công", {
          position: toast.POSITION.TOP_CENTER,
        });
        setTimeout(() => {
          navigate("/list-products-admin");
        }, 500);
      })
      .catch((err) => console.log(err));
  };
};

export const deleteProductToOrder = (id, accessToken) => {
  return (dispatch) => {
    Swal.fire({
      title: "Bạn chắc chưa?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "OK !",
    })
      .then((result) => {
        if (result.isConfirmed) {
          ordersService.deleteProductToOrders(id, accessToken).then((res) => {
            dispatch(createAction(DELETE_PRODUCT_TO_ORDERS, res.data));
            dispatch(getAllProToOrders());
          });
          Swal.fire("Xóa Thành Công!", "success");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
