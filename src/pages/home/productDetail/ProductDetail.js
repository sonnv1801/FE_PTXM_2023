import React, { useEffect, useState } from "react";
import CustomizedBreadcrumbs from "../../../components/customizedBreadcrumbs/CustomizedBreadcrumbs";
import "./style.css";
import Button from "@mui/material/Button";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import IconButton from "@mui/material/IconButton";
import RemoveIcon from "@mui/icons-material/Remove";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";

import AddIcon from "@mui/icons-material/Add";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Tag } from "../../../components/tag/Tag";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCart, getDetail } from "../../../redux/actions/product.action";
import numeral from "numeral";

export const ProductDetail = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm

  function refreshPage() {
    setTimeout(() => {
      window.location.reload(false);
    }, 100);
  }
  const id = location.pathname.split("/")[3];
  useEffect(() => {
    dispatch(getDetail(id));
  }, []);

  const productDetail = useSelector(
    (state) => state.defaultReducer.productDetail
  );

  const handleAddCart = (e) => {
    const newCart = {
      id: productDetail?._id,
      code: productDetail?.code,
      status: productDetail?.status,
      title: productDetail?.title,
      image: productDetail?.image,
      newPrice: productDetail?.newPrice,
      quantity_cart: quantity, // Sử dụng số lượng từ state
    };
    e.preventDefault();

    dispatch(addCart(newCart));
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="prd-dt-container container">
      <div className="breadcrumbs-prd">
        <CustomizedBreadcrumbs name={productDetail?.title} />
      </div>
      <div className="body-prd-dt">
        <div className="sub-body-prd">
          <div className="row">
            <div className="col-6">
              <img src={productDetail?.image} alt="..." />
            </div>
            <div className="col-6">
              <div className="body-ds">
                <h2>{productDetail?.title}</h2>
              </div>
              <div className="prd-dt-code">{productDetail?.code}</div>
              <div className="item-prd">
                <div className="row">
                  <div className="col-6">
                    <span>Đơn giá</span>
                    <h6>{`${numeral(productDetail?.newPrice).format(
                      "0,0"
                    )}đ`}</h6>
                  </div>
                  <div className="col-6">
                    <span>{productDetail?.status}</span>
                    <h6>Còn hàng</h6>
                  </div>
                </div>
              </div>
              <div className="share-prd">
                <p>Share</p>
                <FacebookOutlinedIcon />
                <TwitterIcon />
              </div>
              <div className="action-prd-dt">
                <div className="btn-quantity">
                  <IconButton
                    aria-label="delete"
                    size="large"
                    onClick={decreaseQuantity}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <span>{quantity}</span>
                  <IconButton
                    aria-label="delete"
                    size="large"
                    onClick={increaseQuantity}
                  >
                    <AddIcon />
                  </IconButton>
                </div>
              </div>
              <div className="action-prd-dt-btn">
                <Button variant="outlined" endIcon={<ArrowRightIcon />}>
                  Mua ngay
                </Button>
                <Button
                  variant="outlined"
                  endIcon={<ArrowRightIcon />}
                  onClick={handleAddCart}
                >
                  Thêm vào giỏ
                </Button>
              </div>
              <div className="policy-prd">
                <div className="row">
                  <div className="col-6">
                    <div className="delivery-prd">
                      <img
                        src="https://kimthanh.online/wp-content/uploads/2023/04/chinh-sach-1-150x150.jpg"
                        alt="..."
                      />
                      <p>Chính sách đổi trả</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="delivery-prd">
                      <img
                        src="https://kimthanh.online/wp-content/uploads/2023/04/fast-150x150.jpg"
                        alt="..."
                      />
                      <p>Giao hàng nhanh 2 -3 ngày</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tag-prd">
                <b>TAG</b>
                <div className="row mt-3">
                  <div className="col-4">
                    <Tag />
                  </div>
                  <div className="col-4">
                    <Tag />
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
