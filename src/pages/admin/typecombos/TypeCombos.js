import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Form from "react-bootstrap/Form";

import "./style.css";
import {
  addTypeCombos,
  deleteTypesCombo,
  getAllTypeProductCombo,
} from "../../../redux/actions/typecombo.action";
import Menu from "../menu/Menu";
import { Loading } from "../../../components/loading/Loading";
function TypeCombos() {
  const [showadd, setShowadd] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("token"));
  const [name, setName] = useState("");
  const isLoading = useSelector((state) => state.defaultReducer.isLoading);

  const dispatch = useDispatch();

  const handleCloseAdd = () => {
    setShowadd(false);
  };

  const listTypeComBos = useSelector(
    (state) => state.defaultReducer.listTypeComBo
  );
  useEffect(() => {
    dispatch(getAllTypeProductCombo());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name !== "") {
      const newType = {
        name: name,
        // link: link,
      };
      toast.info("Đang Được Xử Lý, Vui Lòng Đợi Tý...", {
        position: toast.POSITION.TOP_CENTER,
      });
      dispatch(addTypeCombos(newType, currentUser?.accessToken));
      setName("");
      setShowadd(false);
    } else {
      toast.warning("Vui Lòng Nhập Loại ComBo...", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  return (
    <div className="container-listtypeAd">
      <div className="row">
        <div className="col-3 menu-admin-dt">
          <Menu />
        </div>
        <div className="col-xl-9 col-sm-12">
          <div className="title-list">
            <div className="row">
              <div className="col-sm-5">
                <p>Loại Combo</p>
              </div>
              <div className="col-sm-7">
                <button
                  href="#"
                  className="btn btn-outline-danger"
                  onClick={() => {
                    setShowadd(true);
                  }}
                >
                  <i className="bx bxs-folder-plus"></i>
                  <span>Thêm Combo</span>
                </button>
              </div>
            </div>
          </div>
          <div className="table_responsive">
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên Mặt hàng</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="3">
                      <Loading />
                    </td>
                  </tr>
                ) : (
                  <>
                    {listTypeComBos?.map((item, index) => (
                      <Fragment key={item._id}>
                        <tr>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>
                            <button
                              className="btn btn-danger"
                              onClick={() => {
                                dispatch(
                                  deleteTypesCombo(
                                    item._id,
                                    currentUser?.accessToken
                                  )
                                );
                              }}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      </Fragment>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal show={showadd} onHide={handleCloseAdd} className="modal">
        <ModalHeader>
          <ModalTitle>Thêm Loại Phụ Tùng</ModalTitle>
        </ModalHeader>
        <ModalBody className="modal-body">
          <Form.Group className="formgroup-body">
            <Form.Label>Tên Loại: </Form.Label>
            <Form.Control
              type="text"
              // onChange={handleChange('name')}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập Loại..."
            />
          </Form.Group>
        </ModalBody>
        <ModalFooter>
          <Button
            style={{ background: "#198754" }}
            variant="success"
            onClick={handleSubmit}
          >
            Thêm Loại
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default TypeCombos;
