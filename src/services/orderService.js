import Axios from "axios";
const API = "http://localhost:8000/v1/order";

export class OrderService {
  getAllProductToOrder() {
    return Axios.get(`${API}/orders/products`);
  }
}
