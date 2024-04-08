import Axios from "axios";
const API = `${process.env.REACT_APP_API_URL}/v1/product`;

export class ProductService {
  getPrdByType(type, limit) {
    return Axios.get(
      `${process.env.REACT_APP_API_URL}/v1/order/products/${type}`
    );
  }
  getDetail(id) {
    return Axios.get(
      `${process.env.REACT_APP_API_URL}/v1/order/products/byid/${id}`
    );
  }
  getAllProduct() {
    return Axios.get(API);
  }
  addProduct(item, accessToken) {
    return Axios.post(API, item, {
      headers: { token: `vanson ${accessToken}` },
    });
  }
  updateProduct(id, item) {
    return Axios.put(`${API}/${id}`, item);
  }

  deleteProduct(id, accessToken) {
    return Axios.delete(`${API}/${id}`, {
      headers: { token: `vanson ${accessToken}` },
    });
  }
}
