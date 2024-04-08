import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import CardSupplier from "../../../components/cardSupplier/CardSupplier";
import { CartMini } from "../../../components/cartmini/CartMini";
import { getProductSupplierByTypes } from "../../../redux/actions/productSupplier.action";
import { getSupplier } from "../../../redux/actions/supplier.action";
import "./style.css";
export const ShopSupplier = () => {
  const location = useLocation();
  function refreshPage() {
    setTimeout(() => {
      window.location.reload(false);
    }, 100);
  }
  const type = location.pathname.split("/")[2];

  const dispatch = useDispatch();
  const listSupplierByTypeLink = useSelector(
    (state) => state.defaultReducer.listProductSupplierByType
  );
  const listSupplier = useSelector(
    (state) => state.defaultReducer.listSupplier
  );
  useEffect(() => {
    dispatch(getSupplier());
  }, []);

  useEffect(() => {
    dispatch(getProductSupplierByTypes(type, 10000));
  }, []);
  return (
    <div className="shop-container container">
      <div className="category-product">
        <div className="row">
          {listSupplier.map((item, index) => (
            <div key={index} className="col-xl-3 col-sm-6">
              <Link to={`/shopsupplier/${item._id}`} onClick={refreshPage}>
                <CartMini name={item.name} key={index} />
              </Link>
            </div>
          ))}
        </div>
      </div>
      <hr />

      {listSupplierByTypeLink.length === 0 ? (
        <div className="alert alert-warning" role="alert">
          Hiện Tại Nhà Cung Cấp Này Chưa Có Sản Phẩm Nào! Vui Lòng Chọn Nhà Cung
          Cấp Khác Để Mua
        </div>
      ) : (
        <div className="products-body">
          <div className="row sm-product-home-page">
            {listSupplierByTypeLink.map((item, index) => (
              <div key={index} className="col-xl-3 col-sm-12">
                <Link to={`/shop/product-dt-supplier/${item?._id}`}>
                  <CardSupplier item={item} key={index} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
