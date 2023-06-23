import { createAction } from ".";
import { ordersService } from "../../services";
import {
  FETCH_PRODUCTS_TO_ORDERS,
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

export const getAllProToOrders = () => {
  return (dispatch) => {
    dispatch(startLoading());
    ordersService
      .getAllProductToOrder()
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
