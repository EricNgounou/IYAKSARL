import { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { NavBar, Footer } from './components/Static';
import {
  Home,
  Shop,
  Blog,
  About,
  SignPage,
  ProductView,
  CartView,
  DataControlPage,
  AccountPage,
} from './components/pages';
import ScrollToTop from './components/ScrollToTop';
import './styles/index.css';
import { cart } from './data';
import { generateId } from './components/helpers';

function App() {
  const { pathname } = useLocation();
  const signPaths = ['/login', '/register'];
  const shopPaths = ['/shop', '/shop/:id'];

  const [currentUser, setCurrentUser] = useState(null);
  const [itemCount, setItemCount] = useState(cart.items.length);

  const [overlay, setOverlay] = useState(false);
  function updateAddProduct(product, isAdded, setIsAdded) {
    if (!isAdded) {
      updateCart({
        id: generateId(10),
        product_id: product.id,
        order_id: cart.order.id,
        quantity: 1,
        sub_total: parseInt(product.product_price),
      });
      cart.order.total_price += parseInt(product.product_price);
    } else
      cart.items.forEach((item, i) => {
        if (item.product_id === product.id) {
          cart.order.total_price -= item.sub_total;
          updateCart(i, false);
          return;
        }
      });
    setItemCount(cart.items.length);
    setIsAdded(!isAdded);
  }

  function updateCart(item, push = true) {
    if (push) cart.items.unshift(item);
    else cart.items.splice(item, 1);
  }

  const updatesObject = {
    cart: cart.items,
    updateAddProduct,
    itemCount,
  };

  const navBarObject = {
    currentUser,
    itemCount,
  };

  const cartObject = {
    updateCart,
    setItemCount,
    itemCount,
    cart: cart.items,
    currentUser,
    setOverlay,
    overlay,
  };

  const userObject = {
    currentUser,
    setCurrentUser,
    overlay,
    setOverlay,
  };

  const signObject = {
    currentUser,
    setCurrentUser,
  };

  return (
    <>
      <ScrollToTop />
      <NavBar navBarOb={navBarObject} />
      <Routes>
        <Route path="/" element={<Home updatesOb={updatesObject} />} />
        {shopPaths.map((path) => (
          <Route path={path} element={<Shop updatesOb={updatesObject} />} />
        ))}

        <Route path="/blog" element={<Blog />} />
        <Route path="/about" element={<About />} />
        <Route path="/data-control/:id" element={<DataControlPage />} />

        <Route path="/cart" element={<CartView cartOb={cartObject} />} />

        {signPaths.map((path) => (
          <Route path={path} element={<SignPage signOb={signObject} />} />
        ))}

        <Route path="/users" element={<AccountPage userOb={userObject} />} />
        <Route
          path={'/products/:id'}
          element={<ProductView updatesOb={updatesObject} />}
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
