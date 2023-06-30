import Axios from "axios";
const API = "http://localhost:8000/v1/typecombo";

export class TypeComBoService {
  getAllType() {
    return Axios.get(`${API}`);
  }
  addTypeComBo(type, accessToken) {
    return Axios.post(API, type, {
      headers: { token: `vanson ${accessToken}` },
    });
  }
  deleteTypeCombo(id, accessToken) {
    return Axios.delete(`${API}/${id}`, {
      headers: { token: `vanson ${accessToken}` },
    });
  }
}
