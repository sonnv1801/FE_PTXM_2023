import Axios from "axios";
const API = "https://phutungxemay.onrender.com/v1/order";

export class OrderService {
  getAllProductToOrder() {
    return Axios.get(`${API}/orders/products`);
  }
}
