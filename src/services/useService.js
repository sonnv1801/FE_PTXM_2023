import Axios from "axios";
const API = `${process.env.REACT_APP_API_URL}/v1/auth`;

export class UserService {
  Login(user) {
    return Axios.post(`${API}/login`, user);
  }
}
