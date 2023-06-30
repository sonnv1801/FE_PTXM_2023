import Axios from "axios";
const API = "http://localhost:8000/v1/auth";

export class UserService {
  Login(user) {
    return Axios.post(`${API}/login`, user);
  }
}
