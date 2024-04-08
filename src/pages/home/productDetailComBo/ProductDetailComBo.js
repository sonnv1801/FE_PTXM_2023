import React, { useState, useEffect } from "react";
import CustomizedBreadcrumbs from "../../../components/customizedBreadcrumbs/CustomizedBreadcrumbs";
import "./style.css";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getDetailComBo } from "../../../redux/actions/combo.action";
import Modal from "react-bootstrap/Modal";
import numeral from "numeral";
import { Loading } from "../../../components/loading/Loading";

export const ProductDetailComBo = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const id = location.pathname.split("/")[3];
  const isLoading = useSelector((state) => state.defaultReducer.isLoading);

  useEffect(() => {
    dispatch(getDetailComBo(id));
  }, [dispatch, id]);

  function refreshPage() {
    setTimeout(() => {
      window.location.reload(false);
    }, 100);
  }

  const productDetailComBo = useSelector(
    (state) => state.defaultReducer.productDetailComBo
  );
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const updatedSubtotal = selectedProducts.reduce(
      (total, productId, index) =>
        total +
        (productDetailComBo.products[index]?.price || 0) * quantities[index],
      0
    );
    setSubtotal(updatedSubtotal);
  }, [selectedProducts, quantities, productDetailComBo]);

  useEffect(() => {
    const availableProductIds = productDetailComBo?.products
      .filter((item) => item.quantity > 0)
      .map((item) => item._id);
    setSelectedProducts(availableProductIds || []);
    setQuantities(Array(availableProductIds?.length).fill(1));
  }, [productDetailComBo]);

  useEffect(() => {
    const updatedSubtotal = selectedProducts.reduce(
      (total, productId, index) => {
        const product = productDetailComBo?.products?.find(
          (item) => item._id === productId
        );
        const quantity = quantities[index];
        const price = product?.price || 0; // Set price to 0 if product is undefined
        return total + price * quantity;
      },
      0
    );
    setSubtotal(updatedSubtotal);
  }, [selectedProducts, quantities, productDetailComBo]);

  const handleQuantityDecrease = (index) => {
    const updatedQuantities = [...quantities];
    updatedQuantities[index] = Math.max(updatedQuantities[index] - 1, 0);
    setQuantities(updatedQuantities);
  };

  // const handleQuantityIncrease = (index) => {
  //   const updatedQuantities = [...quantities];
  //   updatedQuantities[index] += 1;
  //   setQuantities(updatedQuantities);
  // };

  const handleQuantityIncrease = (index) => {
    const updatedQuantities = [...quantities];
    const product = productDetailComBo?.products?.[index];

    // Kiểm tra xem số lượng sản phẩm đã chọn vượt quá số lượng còn lại không
    if (product && updatedQuantities[index] < product.quantity) {
      updatedQuantities[index] += 1;
      setQuantities(updatedQuantities);
    } else {
      // Hiển thị thông báo hoặc thực hiện hành động khác ở đây (nếu cần)
      toast.warning(`Số lượng sản phẩm đã đạt tối đa`, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const handlePlaceOrder = () => {
    // Lọc ra các sản phẩm có số lượng lớn hơn 0
    const selectedItems = selectedProducts.reduce((acc, productId, index) => {
      const product = productDetailComBo?.products[index];
      const quantity = quantities[index];
      if (quantity > 0) {
        const total = product?.price * quantity;
        acc.push({
          productId: product?._id,
          quantity,
          name: product?.name,
          productCode: product?.productCode,
          price: product?.price,
          image: product?.images,
          title: product?.name,
          total,
        });
      }
      return acc;
    }, []);

    // Tạo đơn hàng combo chỉ với các sản phẩm có số lượng lớn hơn 0
    const comboOrder = {
      _id: productDetailComBo?._id, // Thêm _id của combo vào comboOrder
      quantityCombo: 1,
      image: productDetailComBo?.image,
      comboName: productDetailComBo?.title,
      quantity: selectedItems.length,
      products: selectedItems,
      subtotal: selectedItems.reduce((total, item) => total + item.total, 0),
    };

    // Lấy dữ liệu đơn hàng hiện tại từ localStorage
    const existingOrderData = localStorage.getItem("orderData");
    let dataToStore = [];

    if (existingOrderData) {
      dataToStore = JSON.parse(existingOrderData);

      // Kiểm tra nếu combo đã tồn tại trong orderData
      const existingComboIndex = dataToStore.findIndex(
        (combo) =>
          combo.comboName === comboOrder.comboName &&
          combo.products.length === selectedItems.length &&
          combo.products.every((product, index) => {
            const selectedProduct = selectedItems[index];
            return (
              product.productId === selectedProduct.productId &&
              product.quantity === selectedProduct.quantity
            );
          })
      );

      if (existingComboIndex !== -1) {
        // Tăng quantityCombo lên nếu combo đã tồn tại
        dataToStore[existingComboIndex].quantityCombo += 1;
      } else {
        // Thêm mới combo nếu không tồn tại
        dataToStore.push(comboOrder);
      }
    } else {
      // Thêm mới combo nếu orderData chưa tồn tại
      dataToStore.push(comboOrder);
    }

    // Lưu dữ liệu đơn hàng vào localStorage
    localStorage.setItem("orderData", JSON.stringify(dataToStore));

    // Tính tổng giá trị của đơn hàng
    const totalOrderPrice = dataToStore.reduce(
      (total, combo) => total + combo.subtotal,
      0
    );

    // Lưu tổng giá trị của đơn hàng vào localStorage
    localStorage.setItem("totalOrderPrice", totalOrderPrice.toString());
    toast.success("Thêm thành công sản phẩm", {
      position: toast.POSITION.TOP_CENTER,
    });

    // Refresh trang sau khi thêm sản phẩm vào giỏ hàng
    setTimeout(() => {
      setTimeout(() => {
        refreshPage();
      }, 500);
    });
  };

  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = (product) => {
    setSelected(product);
    setShow(true);
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="prd-combo-container container">
          <div className="link-combo">
            <CustomizedBreadcrumbs name={productDetailComBo?.title} />
          </div>
          <div className="body-prd-combo">
            <div className="sub-body-prd">
              <div className="title-combo">
                {productDetailComBo?.quantity === 0 ? (
                  <b>
                    Sản Phẩm <span>{productDetailComBo?.title}</span> Tạm Thời
                    Hết Hàng
                  </b>
                ) : (
                  <h2>Tất cả sản phẩm có trong {productDetailComBo?.title}</h2>
                )}
              </div>
              <div className="prd-bodys sm-prd-bodys">
                <div className="row">
                  <div className="col-xl-3 col-sm-12">
                    <img
                      src={productDetailComBo?.image}
                      alt={productDetailComBo?.title}
                    />
                  </div>
                  <div className="col-xl-9 col-sm-12">
                    <div className="title-combos">
                      <div className="row">
                        <div className="col-2">
                          <span>Sản Phẩm</span>
                        </div>
                        <div className="col-2">
                          <span>Tên Sản phẩm</span>
                        </div>
                        <div className="col-2">
                          <span>Mã Sản phẩm</span>
                        </div>
                        <div className="col-2">
                          <span>Giá Sản phẩm</span>
                        </div>
                        <div className="col-2">
                          <span>Số lượng</span>
                        </div>
                        <div className="col-2">
                          <span>Tổng</span>
                        </div>
                      </div>
                    </div>
                    <div className="prd-combos">
                      {productDetailComBo?.products?.map((item, index) => (
                        <div className="row" key={item._id}>
                          <div className="col-2">
                            <span>Sản phẩm {index + 1}</span>
                          </div>
                          <div className="col-2">
                            <span
                              onClick={() => handleShow(item)}
                              style={{ cursor: "pointer", color: "pink" }}
                            >
                              {item?.name}
                            </span>
                          </div>
                          <div className="col-2">
                            <span>{item?.productCode}</span>
                          </div>
                          <div className="col-2">
                            <span>{`${numeral(item?.price).format(
                              "0,0"
                            )}đ`}</span>
                          </div>
                          {/* <div className="col-2">
                            {item && (
                              <div className="combos-quantity">
                                <div className="sub-combos-quantity">
                                  <IconButton
                                    aria-label="delete"
                                    size="large"
                                    className="quantityss"
                                    onClick={() =>
                                      handleQuantityDecrease(index)
                                    }
                                  >
                                    <RemoveIcon />
                                  </IconButton>
                                  <span>{quantities[index]}</span>
                                  <IconButton
                                    aria-label="delete"
                                    size="large"
                                    className="quantityss"
                                    onClick={() =>
                                      handleQuantityIncrease(index)
                                    }
                                  >
                                    <AddIcon />
                                  </IconButton>
                                </div>
                              </div>
                            )}
                          </div> */}

                          {item && item.quantity > 0 ? (
                            <div className="col-2">
                              <div className="combos-quantity">
                                <div className="sub-combos-quantity">
                                  <IconButton
                                    aria-label="delete"
                                    size="large"
                                    className="quantityss"
                                    onClick={() =>
                                      handleQuantityDecrease(index)
                                    }
                                  >
                                    <RemoveIcon />
                                  </IconButton>
                                  <span>{quantities[index]}</span>
                                  <IconButton
                                    aria-label="delete"
                                    size="large"
                                    className="quantityss"
                                    onClick={() =>
                                      handleQuantityIncrease(index)
                                    }
                                  >
                                    <AddIcon />
                                  </IconButton>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="col-2">
                              <span>Hết hàng</span>
                            </div>
                          )}

                          {/* {item && item.price && quantities[index] && (
                            <div className="col-2">
                              <span>{`${numeral(
                                item.price * quantities[index]
                              ).format("0,0")}đ`}</span>
                            </div>
                          )} */}
                          <div className="col-2">
                            <span>
                              {quantities[index] > 0
                                ? `${numeral(
                                    item.price * quantities[index]
                                  ).format("0,0")}đ`
                                : "0 đ"}
                            </span>
                          </div>

                          <hr style={{ margin: "1rem 0" }} />
                        </div>
                      ))}
                    </div>
                    <div className="row">
                      <div className="col-xl-6 col-sm-12"></div>
                      <div className="col-xl-6 col-sm-12">
                        <div className="total-combos">
                          <div className="payments-moneys">
                            <b>Tạm tính</b>
                            <p>{`${numeral(subtotal).format("0,0")}đ`}</p>
                          </div>
                          <div className="payments-moneys">
                            <b>Tổng</b>
                            <p>{`${numeral(subtotal).format("0,0")}đ`}</p>
                          </div>
                        </div>

                        <div className="orders-combo">
                          {selectedProducts.length > 0 &&
                            selectedProducts.some(
                              (productId, index) => quantities[index] > 0
                            ) &&
                            productDetailComBo?.quantity > 0 && (
                              <Button
                                variant="contained"
                                onClick={handlePlaceOrder}
                              >
                                Thêm Vào Giỏ
                              </Button>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton style={{ background: "#034063" }}>
              <Modal.Title>{selected?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selected && (
                <>
                  <img
                    style={{ width: "100%" }}
                    src={selected.images}
                    alt={selected?.name}
                    className="modal-image"
                  />
                  <div className="row">
                    <div className="col-6">
                      <div
                        className="modal-info mt-3 mb-3"
                        style={{
                          color: "#034063",
                          fontSize: "18px",
                          fontWeight: "700",
                        }}
                      >
                        <span>Mã Sản Phẩm:</span>
                        <p style={{ color: "blue", fontWeight: "500" }}>
                          {selected.productCode}
                        </p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div
                        className="modal-info mt-3 mb-3"
                        style={{
                          color: "#034063",
                          fontSize: "18px",
                          fontWeight: "700",
                        }}
                      >
                        <span>Giá Mới:</span>{" "}
                        <p style={{ color: "blue", fontWeight: "500" }}>
                          {selected.price}
                        </p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div
                        className="modal-info mt-3 mb-3"
                        style={{
                          color: "#034063",
                          fontSize: "18px",
                          fontWeight: "700",
                        }}
                      >
                        <span>Giá Cũ:</span>{" "}
                        <p style={{ color: "blue", fontWeight: "500" }}>
                          {selected.oldPrice}
                        </p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div
                        className="modal-info mt-3 mb-3"
                        style={{
                          color: "#034063",
                          fontSize: "18px",
                          fontWeight: "700",
                        }}
                      >
                        <span>Số lượng Còn:</span>
                        <p style={{ color: "blue", fontWeight: "500" }}>
                          {selected.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="col-6">
                      <div
                        className="modal-info mt-3 mb-3"
                        style={{
                          color: "#034063",
                          fontSize: "18px",
                          fontWeight: "700",
                        }}
                      >
                        <span>Trạng Thái:</span>{" "}
                        <p style={{ color: "blue", fontWeight: "500" }}>
                          {selected.status}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Add more information here */}
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                style={{ background: "#034063", color: "white" }}
                variant="secondary"
                onClick={handleClose}
              >
                Đóng
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
};
