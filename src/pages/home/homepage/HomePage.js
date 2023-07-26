import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import UncontrolledExample from '../../../components/carousel/Carousel';
import Carousel from '../../../components/carousel/Carousel';
import ImgMediaCard from '../../../components/imgMediaCard/ImgMediaCard';
import ImgMediaCardComBo from '../../../components/imgMediaCard/ImgMediaCardComBo';
import { Loading } from '../../../components/loading/Loading';
import SubNav from '../../../components/subnav/SubNav';
import TitleHead from '../../../components/title/TitleHead';
import TitlePT from '../../../components/titlept/TitlePT';
import { getAllProCombos } from '../../../redux/actions/combo.action';
import { getAllProToOrders } from '../../../redux/actions/order.action';
import { getAllTypeProduct } from '../../../redux/actions/type.action';
import { getAllTypeProductCombo } from '../../../redux/actions/typecombo.action';

import './style.css';
export const HomePage = () => {
  const dispatch = useDispatch();
  const listTypes = useSelector((state) => state.defaultReducer.listType);
  const isLoading = useSelector((state) => state.defaultReducer.isLoading);
  const listProductCombos = useSelector(
    (state) => state.defaultReducer.listProductCombos
  );
  const getAllProductToOrders = useSelector(
    (state) => state.defaultReducer.listProductToOrder
  );

  const listTypeComBos = useSelector(
    (state) => state.defaultReducer.listTypeComBo
  );
  useEffect(() => {
    dispatch(getAllTypeProductCombo());
  }, []);
  useEffect(() => {
    dispatch(getAllProToOrders());
  }, []);
  useEffect(() => {
    dispatch(getAllProCombos());
  }, []);
  useEffect(() => {
    dispatch(getAllTypeProduct());
  }, []);

  console.log(getAllProductToOrders, 'getAllProductToOrders');

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
      <TitlePT type={listTypes} />
      {isLoading ? (
        <Loading />
      ) : (
        <div
          className="mt-5"
          style={{
            background: '#EFEFEF',
            borderRadius: '1rem',
          }}
        >
          {getAllProductToOrders.length === 0 ? (
            <div class="alert alert-primary" role="alert">
              Cửa Hàng Tạm Thời
              <a href="/" class="alert-link">
                {`${''}`} Đã Hết Hàng {`${''}`}
              </a>
              Vui Lòng Chọn Mặt Hàng Khác Để Mua! Cảm Ơn.
            </div>
          ) : (
            <div className="row sm-product-home-page">
              {getAllProductToOrders?.map((item, index) => (
                <div className="col-xl-3 col-sm-12">
                  <Link to={`/shop/product-dt/${item._id}`}>
                    <ImgMediaCard item={item} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <TitleHead type={listTypeComBos} />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="mt-5">
          {listProductCombos.length === 0 ? (
            <div class="alert alert-primary" role="alert">
              Cửa Hàng Tạm Thời
              <a href="/" class="alert-link">
                {`${''}`} Đã Hết Hàng {`${''}`}
              </a>
              Vui Lòng Chọn Mặt Hàng Khác Để Mua! Cảm Ơn.
            </div>
          ) : (
            <div className="row sm-product-home-page">
              {listProductCombos?.map((item, index) => (
                <div className="col-xl-3 col-sm-12">
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
