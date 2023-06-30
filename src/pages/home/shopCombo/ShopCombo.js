import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { CartMini } from "../../../components/cartmini/CartMini";
import ImgMediaCard from "../../../components/imgMediaCard/ImgMediaCard";
import ImgMediaCardComBo from "../../../components/imgMediaCard/ImgMediaCardComBo";
import { TitleStore } from "../../../components/titlestore/TitleStore";
import { getComBoByTypeLink } from "../../../redux/actions/combo.action";
import { getProductByTypes } from "../../../redux/actions/product.action";
import { getAllTypeProduct } from "../../../redux/actions/type.action";
import { getAllTypeProductCombo } from "../../../redux/actions/typecombo.action";
import "./style.css";
export const ShopCombo = () => {
  const location = useLocation();
  function refreshPage() {
    setTimeout(() => {
      window.location.reload(false);
    }, 100);
  }
  const type = location.pathname.split("/")[2];

  const dispatch = useDispatch();
  const listComboByTypeLink = useSelector(
    (state) => state.defaultReducer.listComboByTypeLink
  );
  const listTypeComBo = useSelector(
    (state) => state.defaultReducer.listTypeComBo
  );
  useEffect(() => {
    dispatch(getAllTypeProductCombo());
  }, []);
  useEffect(() => {
    dispatch(getComBoByTypeLink(type, 8));
  }, []);
  console.log(listTypeComBo);
  return (
    <div className="shop-container container">
      <div className="category-product">
        <div className="row">
          {listTypeComBo.map((item, index) => (
            <div className="col-xl-2 col-sm-6">
              <Link to={`/shopcombo/${item.link}`} onClick={refreshPage}>
                <CartMini name={item.name} key={index} />
              </Link>
            </div>
          ))}
        </div>
      </div>
      <hr />
      <div className="title-product-store">
        <TitleStore type={type} />
      </div>
      <div className="products-body">
        <div className="row">
          {listComboByTypeLink.map((item, index) => (
            <div className="col-xl-3 col-sm-6">
              <Link to={`/shop/product-dt-combo/${item?._id}`}>
                <ImgMediaCardComBo item={item} key={index} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
