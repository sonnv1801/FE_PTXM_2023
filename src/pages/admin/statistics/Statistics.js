import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';
import numeral from 'numeral';
import Menu from '../menu/Menu';

function Statistics() {
  const [products, setProducts] = useState([]);
  const [filterTypes, setFilterTypes] = useState([]);
  const [filterCodes, setFilterCodes] = useState([]);
  const [filterSuppliers, setFilterSuppliers] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterCode, setFilterCode] = useState('');
  const [filterSupplier, setFilterSupplier] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    axios
      .get('https://phutungxemay.onrender.com/v1/order/api/products')
      .then((response) => {
        const data = response.data;
        setProducts(data);
        const types = [...new Set(data.map((product) => product.type))];
        const codes = [...new Set(data.map((product) => product.productCode))];
        const suppliers = [...new Set(data.map((product) => product.supplier))];
        setFilterTypes(types);
        setFilterCodes(codes);
        setFilterSuppliers(suppliers);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    let filtered = products;

    if (filterType) {
      filtered = filtered.filter((product) => product.type === filterType);
    }

    if (filterCode) {
      filtered = filtered.filter(
        (product) => product.productCode === filterCode
      );
    }

    if (filterSupplier) {
      filtered = filtered.filter(
        (product) => product.supplier === filterSupplier
      );
    }

    setFilteredProducts(filtered);
  }, [filterType, filterCode, filterSupplier, products]);

  let totalQuantityOrdered = 0;
  let totalQuantityPurchased = 0;
  let totalInventory = 0;
  let totalCost = 0;
  let totalProfit = 0;
  let totalInventoryValue = 0;

  filteredProducts?.forEach((product) => {
    totalQuantityOrdered += product.quantityOrdered;
    totalQuantityPurchased += product.quantityPurchased;
    totalInventory += product.quantityOrdered - product.quantityPurchased;
    totalCost += product.quantityOrdered * product.productPrice;
    totalProfit +=
      (product.retailPrice - product.productPrice) * product.quantityPurchased;
    totalInventoryValue +=
      (product.quantityOrdered - product.quantityPurchased) *
      product.productPrice;
  });

  return (
    <div className="row">
      <div className="col-3 menu-admin-dt">
        <Menu />
      </div>
      <div className="col-xl-9 col-sm-12">
        <div className="statistics-container container">
          <h2>Thống kê sản phẩm</h2>
          <div className="filter-container">
            <div className="filter-item">
              <label htmlFor="filterType">Loại sản phẩm:</label>
              <br></br>
              <select
                id="filterType"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">Tất cả</option>
                {filterTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-item">
              <label htmlFor="filterCode">Mã sản phẩm:</label>
              <br></br>
              <select
                id="filterCode"
                value={filterCode}
                onChange={(e) => setFilterCode(e.target.value)}
              >
                <option value="">Tất cả</option>
                {filterCodes.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-item">
              <label htmlFor="filterSupplier">Nhà cung cấp:</label>
              <br></br>
              <select
                id="filterSupplier"
                value={filterSupplier}
                onChange={(e) => setFilterSupplier(e.target.value)}
              >
                <option value="">Tất cả</option>
                {filterSuppliers.map((supplier) => (
                  <option key={supplier} value={supplier}>
                    {supplier}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <h3 style={{ margin: '1rem 0' }}>Kết quả:</h3>
          <div className="table_responsive">
            <table>
              <thead>
                <tr>
                  <th>Mã sản phẩm</th>
                  <th>Loại sản phẩm</th>
                  <th>Tên sản phẩm</th>
                  <th>Nhà cung cấp</th>
                  <th>Số lượng mua vào</th>
                  <th>Số lượng Bán Ra</th>
                  <th>Tồn Kho</th>
                  <th>Tiền mua vào</th>
                  <th>Lãi Tạm Tính</th>
                  <th>Tiền tồn kho</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const {
                    productCode,
                    type,
                    name,
                    supplier,
                    quantityOrdered,
                    quantityPurchased,
                    retailPrice,
                    // wholesalePrice,
                    productPrice,
                  } = product;
                  return (
                    <tr key={productCode}>
                      <td>{productCode}</td>
                      <td>{type}</td>
                      <td>{name}</td>
                      <td>{supplier}</td>
                      <td>{quantityOrdered}</td>
                      <td>{quantityPurchased}</td>
                      <td>{quantityOrdered - quantityPurchased}</td>
                      <td>
                        {numeral(quantityOrdered * productPrice).format('0,0')}đ
                      </td>
                      <td>
                        {numeral(
                          (retailPrice - productPrice) * quantityPurchased
                        ).format('0,0')}
                        đ
                      </td>
                      <td>
                        {numeral(
                          (quantityOrdered - quantityPurchased) * productPrice
                        ).format('0,0')}
                        đ
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4">Tổng cộng</td>
                  <td>{totalQuantityOrdered}</td>
                  <td>{totalQuantityPurchased}</td>
                  <td>{totalInventory}</td>
                  <td>{`${numeral(totalCost).format('0,0')}đ`}</td>
                  <td>{`${numeral(totalProfit).format('0,0')}đ`}</td>
                  <td>{`${numeral(totalInventoryValue).format('0,0')}đ`}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
