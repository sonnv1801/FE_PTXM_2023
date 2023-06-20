import { createAction } from ".";
import { typeComboService } from "../../services";
import {
  ADD_TYPES_COMBO,
  DELETE_TYPES_COMBO,
  FETCH_TYPE_COMBO_PRODUCT,
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

export const getAllTypeProductCombo = () => {
  return (dispatch) => {
    dispatch(startLoading());
    typeComboService
      .getAllType()
      .then((res) => {
        dispatch(createAction(FETCH_TYPE_COMBO_PRODUCT, res.data));
        dispatch(stopLoading());
      })
      .catch((err) => {
        console.log(err);
        dispatch(stopLoading());
      });
  };
};

export const addTypeCombos = (type, accessToken) => {
  return (dispatch) => {
    typeComboService
      .addTypeComBo(type, accessToken)
      .then((res) => {
        console.log(res.data);
        dispatch(createAction(ADD_TYPES_COMBO, res.data));
        toast.success("Thêm Thành Công!", {
          position: toast.POSITION.TOP_CENTER,
        });
      })
      .catch((err) => console.log(err));
  };
};

export const deleteTypesCombo = (id, accessToken) => {
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
          typeComboService.deleteTypeCombo(id, accessToken).then((res) => {
            dispatch(createAction(DELETE_TYPES_COMBO, res.data));
            dispatch(getAllTypeProductCombo());
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
