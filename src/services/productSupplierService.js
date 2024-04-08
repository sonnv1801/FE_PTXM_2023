import Axios from "axios";
const API = `${process.env.REACT_APP_API_URL}/v1/productsupplier`;

export class ProductSupplierService {
  getPrdSupplierByType(type, limit) {
    return Axios.get(`${API}/${type}/${limit}`);
  }
  getDetailSupplier(id) {
    return Axios.get(`${API}/${id}`);
  }
  getAllProductSupplier() {
    return Axios.get(API);
  }
  addProductSupplier(item, accessToken) {
    return Axios.post(API, item, {
      headers: { token: `vanson ${accessToken}` },
    });
  }
  updateProductSupplier(id, item) {
    return Axios.put(`${API}/${id}`, item);
  }
  deleteProductSupplier(id, accessToken) {
    return Axios.delete(`${API}/${id}`, {
      headers: { token: `vanson ${accessToken}` },
    });
  }
}
