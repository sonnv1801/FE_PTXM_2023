import numeral from "numeral";
import React from "react";

const PrintInvoice = ({ customerId, orders, totalOrderPrice }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="invoice">
        <div className="invoice-logo">
          {/* Insert your company logo here */}
          <img src="company-logo.png" alt="Company Logo" />
        </div>
        <div className="invoice-title">Invoice</div>
        <div className="invoice-details">
          {/* Insert invoice details here */}
          <p>Customer ID: {customerId}</p>
          {/* Add more details as needed */}
        </div>
        <div className="invoice-table">
          {/* Insert table for products and combos here */}
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {/* Iterate over the orders and display the products and combos */}
              {orders.map((order) => (
                <>
                  {/* Iterate over products */}
                  {order.products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.title}</td>
                      <td>{product.quantity_cart}</td>
                      <td>{`${numeral(product.newPrice).format("0,0")}đ`}</td>
                      <td>{`${numeral(
                        product.quantity_cart * product.newPrice
                      ).format("0,0")}đ`}</td>
                    </tr>
                  ))}
                  {/* Iterate over combos */}
                  {order.combos.map((combo) => (
                    <tr key={combo.id}>
                      <td>{combo.comboName}</td>
                      <td>{combo.quantityCombo}</td>
                      <td>{`${numeral(combo.subtotal).format("0,0")}đ`}</td>
                      <td>{`${numeral(
                        combo.subtotal * combo.quantityCombo
                      ).format("0,0")}đ`}</td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
        <div className="invoice-total">
          Total: {`${numeral(totalOrderPrice).format("0,0")}đ`}
        </div>
      </div>
      <button onClick={handlePrint}>Print Invoice</button>
    </div>
  );
};

export default PrintInvoice;
