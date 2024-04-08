import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { CartMini } from "../../../components/cartmini/CartMini";
import ImgMediaCard from "../../../components/imgMediaCard/ImgMediaCard";
import { Loading } from "../../../components/loading/Loading";
import { getProductByTypes } from "../../../redux/actions/product.action";
import { getAllTypeProduct } from "../../../redux/actions/type.action";
import "./style.css";
export const Shop = () => {
  const location = useLocation();
  function refreshPage() {
    setTimeout(() => {
      window.location.reload(false);
    }, 100);
  }
  const type = location.pathname.split("/")[2];

  const dispatch = useDispatch();
  const listProductByType = useSelector(
    (state) => state.defaultReducer.listProductByType
  );
  const listTypePhuTung = useSelector((state) => state.defaultReducer.listType);
  const isLoading = useSelector((state) => state.defaultReducer.isLoading);

  useEffect(() => {
    dispatch(getAllTypeProduct());
  }, []);
  useEffect(() => {
    dispatch(getProductByTypes(type, 8));
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="shop-container container">
          <div className="category-product">
            <div className="row">
              {listTypePhuTung.map((item, index) => (
                <div key={index} className="col-sm-6 col-xl-2 ">
                  <Link to={`/shop/${item.name}`} onClick={refreshPage}>
                    <CartMini name={item.name} key={index} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <hr />
          {listProductByType.length === 0 ? (
            <div className="alert alert-warning" role="alert">
              Hiện Tại Loại Này Chưa Có Sản Phẩm Nào! Vui Lòng Chọn Sản Phẩm
              Loại Khác Để Mua
            </div>
          ) : (
            <div className="products-body">
              <div className="row">
                {listProductByType.map((item, index) => (
                  <div key={index} className="col-xl-3 col-sm-6">
                    <Link to={`/shop/product-dt/${item?._id}`}>
                      <ImgMediaCard item={item} key={index} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
