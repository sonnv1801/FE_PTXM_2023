import Swal from "sweetalert2";
import {
  ADD_CART,
  ADD_PRODUCT,
  ADD_PRODUCT_SUPPLIER,
  ADD_TYPES,
  ADD_TYPES_COMBO,
  ADD_TYPES_SUPPLIER,
  DELETE_CART,
  DELETE_PRODUCT,
  DELETE_PRODUCT_SUPPLIER,
  DELETE_TYPES,
  DELETE_TYPES_COMBO,
  DELETE_TYPES_SUPPLIER,
  FETCH_COMBO_BY_LINK,
  FETCH_DETAIL,
  FETCH_DETAIL_COMBO,
  FETCH_DETAIL_SUPPLIER,
  FETCH_PRODUCTS,
  FETCH_PRODUCTS_COMBOS,
  FETCH_PRODUCTS_TO_ORDERS,
  FETCH_PRODUCT_BY_TYPE,
  FETCH_PRODUCT_SUPPLIER,
  FETCH_PRODUCT_SUPPLIER_BY_TYPE,
  FETCH_SUPPLIER_TYPE,
  FETCH_TYPE_COMBO_PRODUCT,
  FETCH_TYPE_PRODUCT,
  LOGIN_FAILED,
  LOGIN_START,
  LOGIN_SUCCESS,
  NUMBER_QUANTITY,
  START_LOADING,
  STOP_LOADING,
} from "../type/types";

const initialState = {
  login: {
    currentUser: null,
    isFetching: false,
    error: false,
  },
  logout: {
    isFetching: false,
    error: false,
  },
  listType: [],
  listSupplier: [],
  listTypeComBo: [],
  listProductToOrder: [],
  listProductCombos: [],
  listProductByType: [],
  listComboByTypeLink: [],
  listProductSupplierByType: [],
  listProducts: [],
  listProductSupplier: [],
  productDetail: null,
  productDetailSupplier: null,
  productDetailComBo: null,
  cart: [],
};

const defaultReducer = (state = initialState, action) => {
  let { type, payload } = action;
  switch (type) {
    case LOGIN_START: {
      state.login.isFetching = true;
      return { ...state };
    }
    case LOGIN_SUCCESS: {
      state.login.isFetching = false;
      state.login.currentUser = payload;
      state.login.error = false;
      return { ...state };
    }
    case LOGIN_FAILED: {
      state.login.isFetching = false;
      state.login.error = true;
      return { ...state };
    }
    case START_LOADING: {
      state.isLoading = true;
      return { ...state };
    }

    case STOP_LOADING: {
      state.isLoading = false;
      return { ...state };
    }
    case FETCH_TYPE_PRODUCT: {
      state.listType = payload;
      return { ...state }; //setState
    }
    case FETCH_SUPPLIER_TYPE: {
      state.listSupplier = payload;
      return { ...state }; //setState
    }
    case FETCH_TYPE_COMBO_PRODUCT: {
      state.listTypeComBo = payload;
      return { ...state }; //setState
    }
    case FETCH_PRODUCT_BY_TYPE: {
      state.listProductByType = payload;
      return { ...state };
    }
    case FETCH_PRODUCT_SUPPLIER_BY_TYPE: {
      state.listProductSupplierByType = payload;
      return { ...state };
    }
    case FETCH_COMBO_BY_LINK: {
      state.listComboByTypeLink = payload;
      return { ...state };
    }
    case FETCH_DETAIL: {
      state.productDetail = payload;
      return { ...state };
    }

    case FETCH_DETAIL_SUPPLIER: {
      state.productDetailSupplier = payload;
      return { ...state };
    }

    case FETCH_DETAIL_COMBO: {
      state.productDetailComBo = payload;
      return { ...state };
    }
    case ADD_CART: {
      let cart = [...state.cart];
      const index = cart.findIndex((cart) => {
        return cart.id === action.payload.id;
      });

      if (index !== -1) {
        cart[index].quantity_cart += 1;
        // Swal.fire("Đã thêm một sản phẩm trùng tên vào giỏ!", "success");
      } else {
        cart = [...cart, action.payload];
        // Swal.fire("Sản phẩm đã được thêm vào giỏ!", "success");
      }

      // if (cart.color === action.payload.color) {
      //   cart[index].quantity_cart += 1;
      // }
      // cart.push(action.payload);
      // cart = [...cart, action.payload];

      state.cart = cart;
      localStorage.setItem("carts", JSON.stringify(cart));
      return { ...state };
    }
    case DELETE_CART: {
      let cart = [...state.cart];
      const index = cart.findIndex((cartItem) => {
        return cartItem.id === payload.id;
      });
      if (index !== -1) {
        cart.splice(index, 1);
      }
      return { ...state, cart: cart };
    }

    case NUMBER_QUANTITY: {
      let { status, product } = payload;
      let cart = [...state.cart];
      const index = cart.findIndex((cart) => {
        return cart.id === product.id;
      });
      if (index !== -1) {
        if (status) {
          cart[index].quantity_cart += 1;
        } else {
          if (cart[index].quantity_cart > 1) {
            cart[index].quantity_cart -= 1;
          } else {
            cart.splice(cart[index], 1);
          }
        }
      }
      state.cart = cart;
      localStorage.setItem("carts", JSON.stringify(cart));
      return { ...state };
    }

    //admin

    case ADD_TYPES: {
      let updateList = [...state.listType];
      updateList.push(payload);
      state.listType = updateList;
      return { ...state };
    }
    case DELETE_TYPES: {
      let updateList = [...state.listType];
      let index = updateList.findIndex((type) => type.id === action.id);
      if (index === -1) {
        updateList.splice(payload, index);
        state.listType = updateList;
      }

      return { ...state };
    }

    case FETCH_PRODUCTS: {
      state.listProducts = payload;
      return { ...state }; //setState
    }

    case FETCH_PRODUCTS_COMBOS: {
      state.listProductCombos = payload;
      return { ...state }; //setState
    }

    case FETCH_PRODUCTS_TO_ORDERS: {
      state.listProductToOrder = payload;
      return { ...state }; //setState
    }
    case ADD_PRODUCT: {
      let updateList = [...state.listProducts];
      updateList.push(payload);
      state.listProducts = updateList;
      return { ...state };
    }
    case DELETE_PRODUCT: {
      let updateList = [...state.listProducts];
      let index = updateList.findIndex((product) => product.id === action.id);
      if (index === -1) {
        updateList.splice(payload, index);
        state.listProducts = updateList;
      }

      return { ...state };
    }

    case ADD_TYPES_COMBO: {
      let updateList = [...state.listTypeComBo];
      updateList.push(payload);
      state.listTypeComBo = updateList;
      return { ...state };
    }
    case DELETE_TYPES_COMBO: {
      let updateList = [...state.listTypeComBo];
      let index = updateList.findIndex((type) => type.id === action.id);
      if (index === -1) {
        updateList.splice(payload, index);
        state.listTypeComBo = updateList;
      }

      return { ...state };
    }
    case ADD_TYPES_SUPPLIER: {
      let updateList = [...state.listSupplier];
      updateList.push(payload);
      state.listSupplier = updateList;
      return { ...state };
    }
    case DELETE_TYPES_SUPPLIER: {
      let updateList = [...state.listSupplier];
      let index = updateList.findIndex((type) => type.id === action.id);
      if (index === -1) {
        updateList.splice(payload, index);
        state.listSupplier = updateList;
      }

      return { ...state };
    }
    case FETCH_PRODUCT_SUPPLIER: {
      state.listProductSupplier = payload;
      return { ...state }; //setState
    }
    case ADD_PRODUCT_SUPPLIER: {
      let updateList = [...state.listProductSupplier];
      updateList.push(payload);
      state.listProductSupplier = updateList;
      return { ...state };
    }
    case DELETE_PRODUCT_SUPPLIER: {
      let updateList = [...state.listProductSupplier];
      let index = updateList.findIndex((product) => product.id === action.id);
      if (index === -1) {
        updateList.splice(payload, index);
        state.listProductSupplier = updateList;
      }

      return { ...state };
    }
    default:
      return state;
  }
};

export default defaultReducer;
