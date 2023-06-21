import { createAction } from ".";
import { productSupplierService } from "../../services";
import {
  ADD_PRODUCT_SUPPLIER,
  DELETE_PRODUCT_SUPPLIER,
  FETCH_DETAIL_SUPPLIER,
  FETCH_PRODUCT_SUPPLIER,
  FETCH_PRODUCT_SUPPLIER_BY_TYPE,
  START_LOADING,
  STOP_LOADING,
  UPDATE_PRODUCT_SUPPLIER,
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

export const getProductSupplierByTypes = (type, limit) => {
  return (dispatch) => {
    dispatch(startLoading());
    productSupplierService
      .getPrdSupplierByType(type, limit)
      .then((res) => {
        dispatch(createAction(FETCH_PRODUCT_SUPPLIER_BY_TYPE, res.data));
        dispatch(stopLoading());
      })
      .catch((err) => {
        console.log(err);
        dispatch(stopLoading());
      });
  };
};

export const getDetailSuppliers = (id) => {
  return (dispatch) => {
    dispatch(startLoading());
    productSupplierService
      .getDetailSupplier(id)
      .then((res) => {
        dispatch(createAction(FETCH_DETAIL_SUPPLIER, res.data));
        dispatch(stopLoading());
      })
      .catch((err) => {
        console.log(err);
        dispatch(stopLoading());
      });
  };
};

export const getProductSupplier = () => {
  return (dispatch) => {
    dispatch(startLoading());
    productSupplierService
      .getAllProductSupplier()
      .then((res) => {
        dispatch(createAction(FETCH_PRODUCT_SUPPLIER, res.data));
        dispatch(stopLoading());
      })
      .catch((err) => {
        console.log(err);
        dispatch(stopLoading());
      });
  };
};

export const addProductSuppliers = (item, accessToken) => {
  return (dispatch) => {
    productSupplierService
      .addProductSupplier(item, accessToken)
      .then((res) => {
        dispatch(createAction(ADD_PRODUCT_SUPPLIER, res.data));
        // dispatch(getProduct());
        toast.success("Thêm sản phẩm thành công", {
          position: toast.POSITION.TOP_CENTER,
        });
      })
      .catch((err) => console.log(err));
  };
};

export const updateProductSupplier = (id, item, navigate) => {
  return (dispatch) => {
    productSupplierService
      .updateProductSupplier(id, item, navigate)
      .then((res) => {
        dispatch(createAction(UPDATE_PRODUCT_SUPPLIER, res.data));
        dispatch(getProductSupplier());
        toast.success("Sửa sản phẩm thành công", {
          position: toast.POSITION.TOP_CENTER,
        });
        setTimeout(() => {
          navigate("/prducts-supplier");
        }, 500);
      })
      .catch((err) => console.log(err));
  };
};

export const deleteProductSupplier = (id, accessToken) => {
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
          productSupplierService
            .deleteProductSupplier(id, accessToken)
            .then((res) => {
              dispatch(createAction(DELETE_PRODUCT_SUPPLIER, res.data));
              dispatch(getProductSupplier());
            });
          Swal.fire("Xóa Thành Công!", "success");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
