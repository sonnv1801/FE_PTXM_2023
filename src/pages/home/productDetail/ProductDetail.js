import React, { useEffect, useState } from 'react';
import CustomizedBreadcrumbs from '../../../components/customizedBreadcrumbs/CustomizedBreadcrumbs';
import './style.css';
import Button from '@mui/material/Button';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import AddIcon from '@mui/icons-material/Add';
import TwitterIcon from '@mui/icons-material/Twitter';

import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDetail } from '../../../redux/actions/product.action';
import numeral from 'numeral';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loading } from '../../../components/loading/Loading';

export const ProductDetail = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm

  function refreshPage() {
    setTimeout(() => {
      window.location.reload(false);
    }, 100);
  }

  const id = location.pathname.split('/')[3];
  useEffect(() => {
    dispatch(getDetail(id));
  }, []);

  const productDetail = useSelector(
    (state) => state.defaultReducer.productDetail
  );

  const handleAddToCart = () => {
    const existingItems = JSON.parse(localStorage.getItem('carts')) || [];
    const existingItem = existingItems.find((item) => item.id === id);

    const availableQuantity =
      productDetail.quantityDelivered - productDetail.quantityPurchased;

    if (existingItem) {
      const totalQuantity = existingItem.quantity_cart + quantity;
      if (totalQuantity > availableQuantity) {
        toast.error(
          `Số lượng sản phẩm vượt quá số lượng còn (${availableQuantity})`,
          {
            position: toast.POSITION.TOP_CENTER,
          }
        );
        return;
      }
      existingItem.quantity_cart = totalQuantity;
    } else {
      if (quantity > availableQuantity) {
        toast.error(
          `Số lượng sản phẩm vượt quá số lượng còn (${availableQuantity})`,
          {
            position: toast.POSITION.TOP_CENTER,
          }
        );
        return;
      }
      existingItems.push({
        id: productDetail?._id,
        code: productDetail?.productCode,
        title: productDetail?.name,
        image: productDetail?.image,
        newPrice: productDetail?.retailPrice,
        quantity_cart: quantity,
      });
    }

    toast.success(
      `Thêm thành công sản phẩm (${productDetail?.name}) với số lượng (${quantity}) vào giỏ`,
      {
        position: toast.POSITION.TOP_CENTER,
      }
    );
    localStorage.setItem('carts', JSON.stringify(existingItems));
    setTimeout(() => {
      setTimeout(() => {
        refreshPage();
      }, 500);
    }, 500);
  };

  const handleAddBuyNow = () => {
    const existingItems = JSON.parse(localStorage.getItem('carts')) || [];
    const existingItem = existingItems.find((item) => item.id === id);

    const availableQuantity =
      productDetail.quantityDelivered - productDetail.quantityPurchased;

    if (existingItem) {
      const totalQuantity = existingItem.quantity_cart + quantity;
      if (totalQuantity > availableQuantity) {
        toast.error(
          `Số lượng sản phẩm vượt quá số lượng còn (${availableQuantity})`,
          {
            position: toast.POSITION.TOP_CENTER,
          }
        );
        return;
      }
      existingItem.quantity_cart = totalQuantity;
    } else {
      if (quantity > availableQuantity) {
        toast.error(
          `Số lượng sản phẩm vượt quá số lượng còn (${availableQuantity})`,
          {
            position: toast.POSITION.TOP_CENTER,
          }
        );
        return;
      }
      existingItems.push({
        id: productDetail?._id,
        code: productDetail?.productCode,
        title: productDetail?.name,
        image: productDetail?.image,
        newPrice: productDetail?.retailPrice,
        quantity_cart: quantity,
      });
    }

    navigate('/shop/product-dt/cart');
    localStorage.setItem('carts', JSON.stringify(existingItems));
    setTimeout(() => {
      setTimeout(() => {
        refreshPage();
      }, 500);
    }, 500);
  };

  const handleQuantityIncrease = () => {
    const availableQuantity =
      productDetail.quantityDelivered - productDetail.quantityPurchased;

    if (quantity < availableQuantity) {
      setQuantity(quantity + 1);
    } else {
      toast.error(
        `Số lượng sản phẩm vượt quá số lượng còn (${availableQuantity})`,
        {
          position: toast.POSITION.TOP_CENTER,
        }
      );
    }
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (!productDetail) {
    return <Loading />;
  }

  return (
    <div className="prd-dt-container container">
      <div className="breadcrumbs-prd">
        <CustomizedBreadcrumbs name={productDetail.name} />
      </div>
      <div className="body-prd-dt sm-body-prd-dt">
        <div className="sub-body-prd sm-sub-body-prd">
          <div className="row">
            <div className="col-xl-6 col-sm-12">
              <img
                style={{ width: '565px', height: '565px' }}
                src={productDetail.image}
                alt="..."
                className="sm-sub-body-prd-img"
              />
            </div>
            <div className="col-xl-6 col-sm-12">
              <div className="body-ds">
                <h2>{productDetail.name}</h2>
              </div>
              <div className="prd-dt-code">{productDetail.productCode}</div>
              <div className="item-prd">
                <div className="row">
                  <div className="col-6">
                    <span>Giá khuyến mãi</span>
                    <h6>{`${numeral(productDetail.salePrice).format(
                      '0,0'
                    )}đ`}</h6>
                  </div>
                  <div className="col-6">
                    <span>Đơn giá</span>
                    <h6>{`${numeral(productDetail.retailPrice).format(
                      '0,0'
                    )}đ`}</h6>
                  </div>
                  <div className="col-6">
                    <span>Trạng Thái</span>
                    <h6>
                      {productDetail.quantityDelivered ===
                      productDetail.quantityPurchased
                        ? 'Hết Hàng'
                        : `Còn Hàng ${
                            productDetail.quantityDelivered -
                            productDetail.quantityPurchased
                          } Cái`}
                    </h6>
                  </div>
                </div>
              </div>
              <div className="share-prd">
                <p>Share</p>
                <FacebookOutlinedIcon />
                <TwitterIcon />
              </div>
              <div className="action-prd-dt sm-action-prd-dt">
                <div className="btn-quantity sm-btn-quantity">
                  <IconButton
                    className="btn-qtt-dt"
                    aria-label="decrease"
                    size="large"
                    onClick={handleQuantityDecrease}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <span>{quantity}</span>
                  <IconButton
                    className="btn-qtt-dt"
                    aria-label="increase"
                    size="large"
                    onClick={handleQuantityIncrease}
                  >
                    <AddIcon />
                  </IconButton>
                </div>
              </div>
              {productDetail.quantityDelivered !==
                productDetail.quantityPurchased && (
                <div className="action-prd-dt-btn sm-action-prd-dt-btn">
                  <Button
                    variant="outlined"
                    endIcon={<ArrowRightIcon />}
                    onClick={handleAddBuyNow}
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
              )}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
