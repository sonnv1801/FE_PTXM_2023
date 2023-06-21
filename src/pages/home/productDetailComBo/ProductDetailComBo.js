import React, { useState, useEffect } from "react";
import CustomizedBreadcrumbs from "../../../components/customizedBreadcrumbs/CustomizedBreadcrumbs";
import "./style.css";
import axios from "axios";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getDetailComBo } from "../../../redux/actions/combo.action";
import numeral from "numeral";

export const ProductDetailComBo = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const id = location.pathname.split("/")[3];

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
  const [selectAll, setSelectAll] = useState(true);
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
    const allProductIds = productDetailComBo?.products?.map((item) => item._id);
    setSelectedProducts(allProductIds || []);
    setQuantities(Array(allProductIds?.length).fill(1));
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
  const handleProductSelection = (productId) => {
    if (productId === "all") {
      if (selectAll) {
        setSelectedProducts([]);
        setQuantities([]);
        setSelectAll(false);
      } else {
        const allProductIds = productDetailComBo?.products?.map(
          (item) => item._id
        );
        setSelectedProducts(allProductIds);
        setQuantities(Array(allProductIds.length).fill(1));
        setSelectAll(true);
      }
    } else {
      const index = selectedProducts.indexOf(productId);
      if (index === -1) {
        setSelectedProducts((prevSelectedProducts) => [
          ...prevSelectedProducts,
          productId,
        ]);
        setQuantities((prevQuantities) => [...prevQuantities, 1]);
      } else {
        const updatedSelection = selectedProducts.filter(
          (id) => id !== productId
        );
        const updatedQuantities = quantities.filter((_, i) => i !== index);
        setSelectedProducts(updatedSelection);
        setQuantities(updatedQuantities);
      }
      setSelectAll(false);
    }
  };

  const handleQuantityDecrease = (index) => {
    const updatedQuantities = [...quantities];
    updatedQuantities[index] = Math.max(updatedQuantities[index] - 1, 0);
    setQuantities(updatedQuantities);
  };

  const handleQuantityIncrease = (index) => {
    const updatedQuantities = [...quantities];
    updatedQuantities[index] += 1;
    setQuantities(updatedQuantities);
  };

  const handlePlaceOrder = () => {
    const selectedItems = selectedProducts.map((productId, index) => {
      const product = productDetailComBo?.products[index];
      const quantity = quantities[index];
      const total = product?.price * quantity;
      return {
        productId: product?._id,
        quantity,
        name: product?.name,
        productCode: product?.productCode,
        price: product?.price,
        image: productDetailComBo?.image,
        title: productDetailComBo?.title,
        total,
      };
    });

    const comboOrder = {
      quantityCombo: 1,
      image: productDetailComBo?.image,
      comboName: productDetailComBo?.title,
      quantity: selectedItems.length,
      products: selectedItems,
      subtotal: selectedItems.reduce((total, item) => total + item.total, 0),
    };

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

    localStorage.setItem("orderData", JSON.stringify(dataToStore));

    const totalOrderPrice = dataToStore.reduce(
      (total, combo) => total + combo.subtotal,
      0
    );

    localStorage.setItem("totalOrderPrice", totalOrderPrice.toString());
    toast.success("Thêm thành công sản phẩm", {
      position: toast.POSITION.TOP_CENTER,
    });
    setTimeout(() => {
      setTimeout(() => {
        refreshPage();
      }, 500);
    });
  };

  return (
    <div className="prd-combo-container container">
      <div className="link-combo">
        <CustomizedBreadcrumbs name={productDetailComBo?.title} />
      </div>
      <div className="body-prd-combo">
        <div className="sub-body-prd">
          <div className="title-combo">
            <h2>Tất cả sản phẩm có trong {productDetailComBo?.title}</h2>
          </div>
          <div className="prd-bodys">
            <div className="row">
              <div className="col-3">
                <img
                  src={productDetailComBo?.image}
                  alt={productDetailComBo?.title}
                />
              </div>
              <div className="col-9">
                <div className="title-combos">
                  <div className="row">
                    <div className="col-2">
                      <span>
                        <input
                          type="checkbox"
                          checked={
                            selectedProducts.length ===
                              productDetailComBo?.products?.length &&
                            selectedProducts.length > 0
                          }
                          onChange={() => handleProductSelection("all")}
                        />
                        Chọn Tất Cả
                      </span>
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
                    <div className="row" key={item._id.$oid}>
                      <div className="col-2">
                        <span>
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(item._id)}
                            onChange={() => handleProductSelection(item._id)}
                          />
                          Sản phẩm {index + 1}
                        </span>
                      </div>
                      <div className="col-2">
                        <span>{item?.name}</span>
                      </div>
                      <div className="col-2">
                        <span>{item?.productCode}</span>
                      </div>
                      <div className="col-2">
                        <span>{`${numeral(item?.price).format("0,0")}đ`}</span>
                      </div>
                      <div className="col-2">
                        {item && (
                          <div className="combos-quantity">
                            <div className="sub-combos-quantity">
                              <IconButton
                                aria-label="delete"
                                size="large"
                                className="quantityss"
                                onClick={() => handleQuantityDecrease(index)}
                              >
                                <RemoveIcon />
                              </IconButton>
                              <span>{quantities[index]}</span>
                              <IconButton
                                aria-label="delete"
                                size="large"
                                className="quantityss"
                                onClick={() => handleQuantityIncrease(index)}
                              >
                                <AddIcon />
                              </IconButton>
                            </div>
                          </div>
                        )}
                      </div>
                      {item && item.price && quantities[index] && (
                        <div className="col-2">
                          <span>{`${numeral(
                            item.price * quantities[index]
                          ).format("0,0")}đ`}</span>
                        </div>
                      )}
                      <hr style={{ margin: "1rem 0" }} />
                    </div>
                  ))}
                </div>
                <div className="row">
                  <div className="col-6"></div>
                  <div className="col-6">
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
                      {quantities.includes(0) ? (
                        <span>Số lượng phải lớn hơn 0</span>
                      ) : (
                        // Render the button only if at least one product is selected
                        selectedProducts.length > 0 && (
                          <Button
                            variant="contained"
                            onClick={handlePlaceOrder}
                          >
                            Thêm Vào Giỏ
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
