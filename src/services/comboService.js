import Axios from "axios";
const API = "https://phutungxemay.onrender.com/v1/combo";

export class ComBoService {
  getComBoByTypeLink(type, limit) {
    return Axios.get(`${API}/combos/${type}/${limit}`);
  }
  getDetailComBo(id) {
    return Axios.get(`${API}/${id}`);
  }
  getAllProductCombos() {
    return Axios.get(`${API}`);
  }
}
