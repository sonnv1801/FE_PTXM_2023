import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import UncontrolledExample from "../../../components/carousel/Carousel";
import ImgMediaCard from "../../../components/imgMediaCard/ImgMediaCard";
import TitlePT from "../../../components/titlept/TitlePT";
import SubNav from "../../../components/subnav/SubNav";

import { Loading } from "../../../components/loading/Loading";
import { getAllProToOrders } from "../../../redux/actions/order.action";
import { getAllTypeProduct } from "../../../redux/actions/type.action";
import { useState } from "react";
import { Pagination } from "../../pagination/Pagination";
import ProductCombo from "./ProductCombo";

export const HomePage = () => {
  const dispatch = useDispatch();
  const listTypes = useSelector((state) => state.defaultReducer.listType);
  const isLoading = useSelector((state) => state.defaultReducer.isLoading);

  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const getAllProductToOrders = useSelector(
    (state) => state.defaultReducer.listProductToOrder
  );

  useEffect(() => {
    dispatch(getAllProToOrders());
    dispatch(getAllTypeProduct());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllProToOrders(currentPage));
  }, [dispatch, currentPage]);

  useEffect(() => {
    setHasNextPage(getAllProductToOrders.length > 0);
  }, [getAllProductToOrders]);

  return (
    <div className="container-fluid mt-5 text-center">
      <SubNav />
      <div className="main-crs">
        <div className="row">
          <div className="col-12">
            <UncontrolledExample />
          </div>
        </div>
      </div>

      {/* Products list */}

      <TitlePT type={listTypes} />
      {isLoading ? (
        <Loading />
      ) : (
        <div
          className="mt-5"
          style={{
            background: "#EFEFEF",
            borderRadius: "1rem",
          }}
        >
          {getAllProductToOrders.length === 0 ? (
            <div className="alert alert-primary" role="alert">
              Cửa Hàng Tạm Thời
              <a href="/" className="alert-link">
                {" "}
                Đã Hết Hàng{" "}
              </a>
              Vui Lòng Chọn Mặt Hàng Khác Để Mua! Cảm Ơn.
            </div>
          ) : (
            <>
              <div className="row sm-product-home-page">
                {getAllProductToOrders?.map((item, index) => (
                  <div key={index} className="col-xl-3 col-sm-12">
                    <Link to={`/shop/product-dt/${item._id}`}>
                      <ImgMediaCard item={item} />
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
        hasNextPage={hasNextPage}
      />

      {/* Combo products */}
      <ProductCombo />
    </div>
  );
};

export default HomePage;
