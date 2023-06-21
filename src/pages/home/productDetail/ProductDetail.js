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
import { getDetail } from "../../../redux/actions/product.action";
import numeral from "numeral";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

  const handleAddToCart = () => {
    const existingItems = JSON.parse(localStorage.getItem("carts")) || [];
    const existingItem = existingItems.find((item) => item.id === id);

    if (existingItem) {
      existingItem.quantity_cart += quantity;
    } else {
      existingItems.push({
        id: productDetail?._id,
        code: productDetail?.code,
        status: productDetail?.status,
        title: productDetail?.title,
        image: productDetail?.image,
        newPrice: productDetail?.newPrice,
        quantity_cart: quantity,
      });
    }
    toast.success(
      `Thêm thành công sản phẩm (${productDetail?.title}) với số lượng (${quantity}) vào giỏ`,
      {
        position: toast.POSITION.TOP_CENTER,
      }
    );
    localStorage.setItem("carts", JSON.stringify(existingItems));
    setTimeout(() => {
      setTimeout(() => {
        refreshPage();
      }, 500);
    }, 500);
  };

  const handleQuantityIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (!productDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="prd-dt-container container">
      <div className="breadcrumbs-prd">
        <CustomizedBreadcrumbs name={productDetail.title} />
      </div>
      <div className="body-prd-dt">
        <div className="sub-body-prd">
          <div className="row">
            <div className="col-6">
              <img src={productDetail.image} alt="..." />
            </div>
            <div className="col-6">
              <div className="body-ds">
                <h2>{productDetail.title}</h2>
              </div>
              <div className="prd-dt-code">{productDetail.code}</div>
              <div className="item-prd">
                <div className="row">
                  <div className="col-6">
                    <span>Đơn giá</span>
                    <h6>{`${numeral(productDetail.newPrice).format(
                      "0,0"
                    )}đ`}</h6>
                  </div>
                  <div className="col-6">
                    <span>{productDetail.status}</span>
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
                    aria-label="decrease"
                    size="large"
                    onClick={handleQuantityDecrease}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <span>{quantity}</span>
                  <IconButton
                    aria-label="increase"
                    size="large"
                    onClick={handleQuantityIncrease}
                  >
                    <AddIcon />
                  </IconButton>
                </div>
              </div>
              <div className="action-prd-dt-btn">
                <Button
                  variant="outlined"
                  endIcon={<ArrowRightIcon />}
                  onClick={handleAddToCart}
                >
                  Mua ngay
                </Button>
                <Button
                  variant="outlined"
                  endIcon={<ArrowRightIcon />}
                  onClick={handleAddToCart}
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
                      <p>Giao hàng nhanh 2 - 3 ngày</p>
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
