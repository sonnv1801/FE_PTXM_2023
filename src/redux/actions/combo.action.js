import { createAction } from ".";
import { comboService } from "../../services";
import {
  FETCH_COMBO_BY_LINK,
  FETCH_DETAIL_COMBO,
  FETCH_PRODUCTS_COMBOS,
  FETCH_PRODUCT_DETAIL_TO__COMBO,
  START_LOADING,
  STOP_LOADING,
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

export const getComBoByTypeLink = (type, limit) => {
  return (dispatch) => {
    dispatch(startLoading());
    comboService
      .getComBoByTypeLink(type, limit)
      .then((res) => {
        dispatch(createAction(FETCH_COMBO_BY_LINK, res.data));
        dispatch(stopLoading());
      })
      .catch((err) => {
        console.log(err);
        dispatch(stopLoading());
      });
  };
};

export const getDetailComBo = (id) => {
  return (dispatch) => {
    dispatch(startLoading());
    comboService
      .getDetailComBo(id)
      .then((res) => {
        dispatch(createAction(FETCH_DETAIL_COMBO, res.data));
        dispatch(stopLoading());
      })
      .catch((err) => {
        console.log(err);
        dispatch(stopLoading());
      });
  };
};

export const getAllProCombos = (page) => {
  return (dispatch) => {
    dispatch(startLoading());
    comboService
      .getAllProductCombos(page)
      .then((res) => {
        dispatch(createAction(FETCH_PRODUCTS_COMBOS, res.data));
        dispatch(stopLoading());
      })
      .catch((err) => {
        console.log(err);
        dispatch(stopLoading());
      });
  };
};

export const getProductDetailToComBos = (id) => {
  return (dispatch) => {
    dispatch(startLoading());
    comboService
      .getProductDetailToComBo(id)
      .then((res) => {
        dispatch(createAction(FETCH_PRODUCT_DETAIL_TO__COMBO, res.data));
        dispatch(stopLoading());
      })
      .catch((err) => {
        console.log(err);
        dispatch(stopLoading());
      });
  };
};
