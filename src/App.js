import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import "./index.css";
import { Cart } from "./pages/home/cart/Cart";
import { HomePage } from "./pages/home/homepage/HomePage";
import { ProductDetail } from "./pages/home/productDetail/ProductDetail";
import { Shop } from "./pages/home/shop/Shop";
import { ProductDetailComBo } from "./pages/home/productDetailComBo/ProductDetailComBo";
import { ProductDetailSupplier } from "./pages/home/productDetailSupplier/ProductDetailSupplier";
import Login from "./pages/home/login/Login";
import Contact from "./pages/home/contact/Contact"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShopCombo } from "./pages/home/shopCombo/ShopCombo";
import { ShopSupplier } from "./pages/home/shopSupplier/ShopSupplier";
import { CartPage } from "./pages/home/cartpage/CartPage";
import OrderPage from "./pages/home/orderpage/OrderPage";
import Delivery from "./pages/home/delivery/Delivery";
import PurchaseHistory from "./pages/home/purchasehistory/PurchaseHistory";
import NotFound from "./pages/home/notfound/NotFound";
import { HomePageAdmin } from "./pages/admin/homepage/HomePage";
import Menu from "./pages/admin/menu/Menu";
import Type from "./pages/admin/type/Type";
import ListProductAdmin from "./pages/admin/listproductadmin/ListProductAdmin";
import EditProduct from "./pages/admin/updateProducts/EditProduct";
import TypeCombos from "./pages/admin/typecombos/TypeCombos";
import ListProductComboAdmin from "./pages/admin/listproductcomboadmin/ListProductComboAdmin";
import { OrderCustomer } from "./pages/admin/ordercustomer/OrderCustomer";
import TypeSupplier from "./pages/admin/typesupplier/TypeSupplier";
import ListProductSupplier from "./pages/admin/listproductsupplier/ListProductSupplier";
import UpdateProductSupplier from "./pages/admin/updateproductsupplier/UpdateProductSupplier";
import Statistics from "./pages/admin/statistics/Statistics";
import PrintInvoice from "./pages/home/printInvoice/PrintInvoice";
import Footer from "./pages/home/footer/Footer";
import EditComboPage from "./pages/admin/editcombopage/EditComboPage";
function App() {
  const user = JSON.parse(localStorage.getItem("token"));
  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop/:id" element={<Shop />} />
          <Route path="/shopcombo/:id" element={<ShopCombo />} />
          <Route path="/contact" element={<Contact/>}/>
          {/* <Route path="/shopsupplier/:id" element={<ShopSupplier />} /> */}
          <Route path="/shop/product-dt/:id" element={<ProductDetail />} />
          <Route path="/shop/product-dt/cart" element={<Cart />} />
          <Route
            path="/shop/product-dt-combo/:id"
            element={<ProductDetailComBo />}
          />
          <Route
            path="/shop/product-dt-supplier/:id"
            element={<ProductDetailSupplier />}
          />
          {/* <Route path="/cart-supplier" element={<CartPage />} /> */}
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<HomePage />} />

          {user === null ? (
            <>
              <Route path="*" element={<NotFound />} />
            </>
          ) : (
            <>
              <Route path="/history" element={<PurchaseHistory />} />
              <Route path="/printInvoice" element={<PrintInvoice />} />
              {/* <Route path="/orderpage" element={<OrderPage />} /> */}
            </>
          )}

          <Route path="*" element={<NotFound />} />

          {user?.role === true ? (
            <>
              <Route path="/cart-supplier" element={<CartPage />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/shopsupplier/:id" element={<ShopSupplier />} />
              <Route path="/orderpage" element={<OrderPage />} />
              <Route path="/admin" element={<HomePageAdmin />} />
              <Route path="/delivery" element={<Delivery />} />
              <Route path="/list-types" element={<Type />} />
              <Route path="/types-supplier" element={<TypeSupplier />} />
              <Route
                path="/prducts-supplier"
                element={<ListProductSupplier />}
              />
              <Route path="/list-combos" element={<TypeCombos />} />
              <Route path="/edit-combos/:id" element={<EditComboPage />} />
              <Route path="/order-customer" element={<OrderCustomer />} />
              <Route
                path="/list-products-admin/:id"
                element={<EditProduct />}
              />
              <Route
                path="/list-products-supplier/:id"
                element={<UpdateProductSupplier />}
              />
              <Route
                path="/list-products-admin"
                element={<ListProductAdmin />}
              />
              <Route
                path="/list-products-combos-admin"
                element={<ListProductComboAdmin />}
              />
            </>
          ) : (
            <Route path="*" element={<NotFound />} />
          )}
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
