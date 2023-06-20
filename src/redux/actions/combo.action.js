import { createAction } from ".";
import { comboService } from "../../services";
import {
  FETCH_COMBO_BY_LINK,
  FETCH_DETAIL_COMBO,
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
