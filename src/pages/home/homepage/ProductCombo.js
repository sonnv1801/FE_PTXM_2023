import React, { useEffect } from "react";
import TitleHead from "../../../components/title/TitleHead";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "../../../components/loading/Loading";
import { Link } from "react-router-dom";
import ImgMediaCardComBo from "../../../components/imgMediaCard/ImgMediaCardComBo";
import { getAllTypeProductCombo } from "../../../redux/actions/typecombo.action";
import { getAllProCombos } from "../../../redux/actions/combo.action";

const ProductCombo = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.defaultReducer.isLoading);
  const listProductCombos = useSelector(
    (state) => state.defaultReducer.listProductCombos
  );

  const listTypeComBos = useSelector(
    (state) => state.defaultReducer.listTypeComBo
  );
  useEffect(() => {
    dispatch(getAllTypeProductCombo());
    dispatch(getAllProCombos());
  }, [dispatch]);

  return (
    <div>
      <TitleHead type={listTypeComBos} />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="mt-5">
          {listProductCombos.length === 0 ? (
            <div className="alert alert-primary" role="alert">
              Cửa Hàng Tạm Thời
              <a href="/" className="alert-link">
                {" "}
                Đã Hết Hàng{" "}
              </a>
              Vui Lòng Chọn Mặt Hàng Khác Để Mua! Cảm Ơn.
            </div>
          ) : (
            <div className="row sm-product-home-page">
              {listProductCombos?.map((item, index) => (
                <div key={index} className="col-xl-3 col-sm-12">
                  <Link to={`/shop/product-dt-combo/${item._id}`}>
                    <ImgMediaCardComBo item={item} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCombo;
