import { createAction } from ".";
import { supplierService } from "../../services";
import {
  ADD_TYPES_SUPPLIER,
  DELETE_TYPES_SUPPLIER,
  FETCH_SUPPLIER_TYPE,
  START_LOADING,
  STOP_LOADING,
} from "../type/types";

import { ToastContainer, toast } from "react-toastify";
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

export const getSupplier = () => {
  return (dispatch) => {
    dispatch(startLoading());
    supplierService
      .getAllSupplier()
      .then((res) => {
        dispatch(createAction(FETCH_SUPPLIER_TYPE, res.data));
        dispatch(stopLoading());
      })
      .catch((err) => {
        console.log(err);
        dispatch(stopLoading());
      });
  };
};

export const addTypeSuppliers = (type, accessToken) => {
  return (dispatch) => {
    supplierService
      .addTypeSupplier(type, accessToken)
      .then((res) => {
        console.log(res.data);
        dispatch(createAction(ADD_TYPES_SUPPLIER, res.data));
        toast.success("Thêm Thành Công!", {
          position: toast.POSITION.TOP_CENTER,
        });
      })
      .catch((err) => console.log(err));
  };
};

export const deleteTypesSupplier = (id, accessToken) => {
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
          supplierService.deleteTypeSupplier(id, accessToken).then((res) => {
            dispatch(createAction(DELETE_TYPES_SUPPLIER, res.data));
            dispatch(getSupplier());
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
