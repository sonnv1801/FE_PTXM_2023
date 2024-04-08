import { createAction } from ".";
import { typeService } from "../../services";
import {
  ADD_TYPES,
  DELETE_TYPES,
  FETCH_TYPE_PRODUCT,
  START_LOADING,
  STOP_LOADING,
} from "../type/types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
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

export const getAllTypeProduct = () => {
  return (dispatch) => {
    dispatch(startLoading());
    typeService
      .getAllType()
      .then((res) => {
        dispatch(createAction(FETCH_TYPE_PRODUCT, res.data));
        dispatch(stopLoading());
      })
      .catch((err) => {
        console.log(err);
        dispatch(stopLoading());
      });
  };
};

export const addTypes = (type, accessToken) => {
  return (dispatch) => {
    typeService
      .addType(type, accessToken)
      .then((res) => {
        console.log(res.data);
        dispatch(createAction(ADD_TYPES, res.data));
        toast.success("Thêm Thành Công!", {
          position: toast.POSITION.TOP_CENTER,
        });
      })
      .catch((err) => console.log(err));
  };
};

export const deleteTypes = (id, accessToken) => {
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
          typeService.deleteType(id, accessToken).then((res) => {
            dispatch(createAction(DELETE_TYPES, res.data));
            dispatch(getAllTypeProduct());
            dispatch(stopLoading());
          });
          toast.success("Xóa Thành Công!", {
            position: toast.POSITION.TOP_CENTER,
          });
          dispatch(stopLoading());
        }
      })
      .catch((err) => console.log(err));
  };
};
