import Axios from "axios";
const API = "https://phutungxemay.onrender.com/v1/order";

export class OrderService {
  getAllProductToOrder() {
    return Axios.get(`${API}/orders/products`);
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
