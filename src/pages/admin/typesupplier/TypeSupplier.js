import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import Button from "react-bootstrap/Button";

import Form from "react-bootstrap/Form";

import "./style.css";
import {
  addTypeCombos,
  deleteTypesCombo,
  getAllTypeProductCombo,
} from "../../../redux/actions/typecombo.action";
import Menu from "../menu/Menu";
import {
  addTypeSuppliers,
  deleteTypesSupplier,
  getSupplier,
} from "../../../redux/actions/supplier.action";
function TypeSupplier() {
  const [showadd, setShowadd] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("token"));
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const isLoading = useSelector((state) => state.defaultReducer.isLoading);

  const dispatch = useDispatch();

  const handleCloseAdd = () => {
    setShowadd(false);
  };

  const listSupplier = useSelector(
    (state) => state.defaultReducer.listSupplier
  );
  useEffect(() => {
    dispatch(getSupplier());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newType = {
      name: name,
      link: link,
    };
    dispatch(addTypeSuppliers(newType, currentUser?.accessToken));
    setShowadd(false);
  };

  return (
    <div className="container-listtypeAd">
      <div className="row">
        <div className="col-3">
          <Menu />
        </div>
        <div className="col-9">
          <div className="title-list">
            <div className="row">
              <div className="col-sm-5">
                <p>Nhà Cung Cấp</p>
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
                  <span>Thêm Nhà Cung Cấp</span>
                </button>
              </div>
            </div>
          </div>
          <table className="table">
            <thead classNane="table-dark">
              <tr>
                <th>STT</th>
                <th>Tên Nhà Cung Cấp</th>
                <th>Xoá</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <div
                  className="spinner-border"
                  role="status"
                  style={{ margin: "0 auto" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <>
                  {listSupplier?.map((item, index) => (
                    <>
                      <tr>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              dispatch(
                                deleteTypesSupplier(
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
                    </>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={showadd} onHide={handleCloseAdd} className="modal">
        <ModalHeader>
          <ModalTitle>Thêm Nhà Cung Cấp</ModalTitle>
        </ModalHeader>
        <ModalBody className="modal-body">
          <Form.Group className="formgroup-body">
            <Form.Label>Tên Nhà Cung Cấp: </Form.Label>
            <Form.Control
              type="text"
              // onChange={handleChange('name')}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập Loại..."
            />
            <Form.Label>Đường Dẫn: </Form.Label>
            <Form.Control
              type="text"
              // onChange={handleChange('name')}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Nhập link..."
            />
          </Form.Group>
        </ModalBody>
        <ModalFooter>
          <Button variant="success" onClick={handleSubmit}>
            Thêm Nhà Cung Cấp
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default TypeSupplier;
