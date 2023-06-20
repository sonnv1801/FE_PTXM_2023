import Axios from "axios";
const API = "https://phutungxemay.onrender.com/v1/product";

export class ProductService {
  getPrdByType(type, limit) {
    return Axios.get(`${API}/products/${type}/${limit}`);
  }
  getDetail(id) {
    return Axios.get(`${API}/${id}`);
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
