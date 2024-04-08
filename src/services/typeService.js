import Axios from "axios";
const API = `${process.env.REACT_APP_API_URL}/v1/type`;

export class TypeService {
  getAllType() {
    return Axios.get(`${API}`);
  }
  addType(type, accessToken) {
    return Axios.post(API, type, {
      headers: { token: `vanson ${accessToken}` },
    });
  }
  deleteType(id, accessToken) {
    return Axios.delete(`${API}/${id}`, {
      headers: { token: `vanson ${accessToken}` },
    });
  }
}
