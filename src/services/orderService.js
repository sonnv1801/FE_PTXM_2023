import Axios from "axios";
const API = `${process.env.REACT_APP_API_URL}/v1/order`;

export class OrderService {
  getAllProductToOrder(page) {
    return Axios.get(`${API}/orders/products?page=${page}`);
  }
  deleteProductToOrders(id, accessToken) {
    return Axios.delete(`${API}/products/${id}`, {
      headers: { token: `vanson ${accessToken}` },
    });
  }
  updateProductoOrders(id, item) {
    return Axios.put(`${API}/orders/products/${id}`, item);
  }
}
