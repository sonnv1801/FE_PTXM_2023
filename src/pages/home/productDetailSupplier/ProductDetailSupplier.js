import React, { useEffect, useState } from 'react';
import CustomizedBreadcrumbs from '../../../components/customizedBreadcrumbs/CustomizedBreadcrumbs';
import './style.css';
import Button from '@mui/material/Button';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Input from '@mui/joy/Input';
import AddIcon from '@mui/icons-material/Add';
import TwitterIcon from '@mui/icons-material/Twitter';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailSuppliers } from '../../../redux/actions/productSupplier.action';
import { useLocation, useNavigate } from 'react-router-dom';
import numeral from 'numeral';

export const ProductDetailSupplier = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = location.pathname.split('/')[3];
  useEffect(() => {
    dispatch(getDetailSuppliers(id));
  }, [dispatch, id]);

  const productDetailSupplier = useSelector(
    (state) => state.defaultReducer.productDetailSupplier
  );
  const [quantity, setQuantity] = useState(0);

  // Function to handle adding the product to localStorage
  const handleAddToCart = (purchaseType) => {
    if (quantity <= 0) {
      // Quantity not entered or is 0, do not add to cart
      return;
    }

    // Get the existing cart data from localStorage
    const existingCartData = localStorage.getItem('cart');
    let cart = {};

    if (existingCartData) {
      // If cart data exists in localStorage, parse and use it
      cart = JSON.parse(existingCartData);
    }

    // Create the product object with code, quantity, and purchaseType
    const product = {
      productCode: productDetailSupplier?.productCode,
      quantity: quantity,
      purchaseType: purchaseType,
    };

    // Add the product to the cart
    if (!cart.products) {
      cart.products = [];
    }
    cart.products.push(product);

    // Add the customerId to the cart
    cart.customerId = '648bf7d3c204a9c67ec0c88e';

    // Update the cart data in localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Clear the quantity input
    setQuantity(0);
    toast.success('Đặt Hàng Thành Công!', {
      position: toast.POSITION.TOP_CENTER,
    });
    navigate('/cart-supplier');
  };

  return (
    <div className="prd-dt-container container">
      <div className="breadcrumbs-prd">
        <CustomizedBreadcrumbs name={productDetailSupplier?.name} />
      </div>
      <div className="body-prd-dt">
        <div className="sub-body-prd sm-sub-body-prd">
          <div className="row">
            <div className="col-xl-6 col-sm-12">
              <img
                src={productDetailSupplier?.image}
                alt={productDetailSupplier?.name}
                className="sm-sub-body-prd-img"
              />
            </div>
            <div className="col-xl-6 col-sm-12">
              <div className="body-ds">
                <h2>{productDetailSupplier?.name} </h2>
              </div>
              <div className="prd-dt-code">
                {productDetailSupplier?.productCode}{' '}
              </div>
              <div className="item-prd">
                <div className="row">
                  <div className="col-6">
                    <span>Đơn giá</span>
                    <h6>
                      {' '}
                      {`${numeral(productDetailSupplier?.salePrice).format(
                        '0,0'
                      )}đ`}
                    </h6>
                  </div>
                  <div className="col-6">
                    <span>Giá Sale</span>
                    <h6>{`${numeral(productDetailSupplier?.retailPrice).format(
                      '0,0'
                    )}đ`}</h6>
                  </div>
                  <div className="col-6">
                    <span>Giá Vốn Thường</span>
                    <h6>{`${numeral(
                      productDetailSupplier?.wholesalePrice
                    ).format('0,0')}đ`}</h6>
                  </div>
                  <div className="col-6">
                    <span>Giá Vốn Nhanh</span>
                    <h6>{`${numeral(
                      productDetailSupplier?.wholesalePriceQuick
                    ).format('0,0')}đ`}</h6>
                  </div>
                  <div className="col-6">
                    <span>Số lượng Còn</span>
                    <h6>{productDetailSupplier?.quantity}</h6>
                  </div>
                </div>
              </div>
              <div className="share-prd">
                <p>Share</p>
                <FacebookOutlinedIcon />
                <TwitterIcon />
              </div>
              <div className="action-prd-dt  sm-action-prd-dt">
                <Input
                  placeholder="Nhập số lượng cần mua"
                  type="number"
                  // value={quantity}
                  variant="plain"
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
              </div>
              <div className="action-prd-dt-btn">
                {quantity > 0 && (
                  <>
                    <Button
                      variant="outlined"
                      endIcon={<ArrowRightIcon />}
                      onClick={() => handleAddToCart('regular')}
                    >
                      Mua Thường
                    </Button>
                    <Button
                      variant="outlined"
                      endIcon={<ArrowRightIcon />}
                      onClick={() => handleAddToCart('quick')}
                    >
                      Mua Nhanh
                    </Button>
                  </>
                )}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
