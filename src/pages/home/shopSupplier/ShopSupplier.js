import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import CardSupplier from "../../../components/cardSupplier/CardSupplier";
import { CartMini } from "../../../components/cartmini/CartMini";
import { TitleStore } from "../../../components/titlestore/TitleStore";
import { getComBoByTypeLink } from "../../../redux/actions/combo.action";
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
    dispatch(getProductSupplierByTypes(type, 8));
  }, []);
  console.log(listSupplier);
  return (
    <div className="shop-container container">
      <div className="category-product">
        <div className="row">
          {listSupplier.map((item, index) => (
            <div className="col-2">
              <Link to={`/shopsupplier/${item._id}`} onClick={refreshPage}>
                <CartMini name={item.name} key={index} />
              </Link>
            </div>
          ))}
        </div>
      </div>
      <hr />
      <div className="title-product-store">
        <TitleStore />
      </div>
      <div className="products-body">
        <div className="row">
          {listSupplierByTypeLink.map((item, index) => (
            <div className="col-3">
              <Link to={`/shop/product-dt-supplier/${item?._id}`}>
                <CardSupplier item={item} key={index} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
