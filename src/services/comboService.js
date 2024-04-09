import Axios from "axios";
const API = `${process.env.REACT_APP_API_URL}/v1/combo`;

export class ComBoService {
  getComBoByTypeLink(type, limit) {
    return Axios.get(`${API}/combos/${type}/${limit}`);
  }
  getDetailComBo(id) {
    return Axios.get(`${API}/${id}`);
  }
  getAllProductCombos(page) {
    // return Axios.get(`${API}`);
    return Axios.get(`http://localhost:8000/v1/combo?page=${page}`);
  }
  getProductDetailToComBo(id) {
    return Axios.get(`${API}/combos/products/product/${id}`);
  }
}
