import Axios from 'axios';
const API = 'https://phutungxemay.onrender.com/v1/supplier';

export class SupplierService {
  getAllSupplier() {
    return Axios.get(`${API}`);
  }
  addTypeSupplier(type, accessToken) {
    return Axios.post(API, type, {
      headers: { token: `vanson ${accessToken}` },
    });
  }
  deleteTypeSupplier(id, accessToken) {
    return Axios.delete(`${API}/${id}`, {
      headers: { token: `vanson ${accessToken}` },
    });
  }
}
