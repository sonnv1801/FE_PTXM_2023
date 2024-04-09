import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import TitleHead from "../../../components/title/TitleHead";
import ImgMediaCardComBo from "../../../components/imgMediaCard/ImgMediaCardComBo";
import { Loading } from "../../../components/loading/Loading";

import { getAllTypeProductCombo } from "../../../redux/actions/typecombo.action";
import { getAllProCombos } from "../../../redux/actions/combo.action";
import { Pagination } from "../../pagination/Pagination";

const ProductCombo = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const listProductCombos = useSelector(
    (state) => state.defaultReducer.listProductCombos
  );
  const listTypeComBos = useSelector(
    (state) => state.defaultReducer.listTypeComBo
  );

  useEffect(() => {
    dispatch(getAllTypeProductCombo());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllProCombos(currentPage));
    setIsLoading(false);
  }, [dispatch, currentPage]);

  useEffect(() => {
    setHasNextPage(listProductCombos.length > 0);
  }, [listProductCombos]);

  if (isLoading) {
    return <Loading />;
  }

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div>
      <TitleHead type={listTypeComBos} />
      <div className="mt-5">
        {listProductCombos.length === 0 ? (
          <div className="alert alert-primary" role="alert">
            Cửa Hàng Tạm Thời
            <a style={{ padding: "0 0.3rem" }} href="/" className="alert-link">
              Đã Hết Hàng
            </a>
            Vui Lòng Chọn Mặt Hàng Khác Để Mua! Cảm Ơn.
          </div>
        ) : (
          <div className="row sm-product-home-page">
            {listProductCombos.map((item) => (
              <div key={item._id} className="col-xl-3 col-sm-12">
                <Link to={`/shop/product-dt-combo/${item._id}`}>
                  <ImgMediaCardComBo item={item} />
                </Link>
              </div>
            ))}
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          goToPreviousPage={goToPreviousPage}
          goToNextPage={goToNextPage}
          hasNextPage={hasNextPage}
        />
      </div>
    </div>
  );
};

export default ProductCombo;
