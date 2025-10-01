import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { NavBar } from './components/Static';
// import { Home, Articles, Blog, About } from "./components/pages";
import Home from './components/pages/Home';
import Shop from './components/pages/Shop';
import Blog from './components/pages/Blog';
import About from './components/pages/About';
import ScrollToTop from './components/ScrollToTop';
import { Footer } from './components/Static';
import { ProdOverlay } from './components/Static';
import './App.css';
import './styles/Articles.css';

function App() {
  const [product, setProduct] = useState(null);

  const updatesObject = {
    product,
    updateOverlay(prod) {
      setProduct(prod);
    },
  };
  return (
    <>
      <ScrollToTop />
      <NavBar />
      <ProdOverlay updatesOb={updatesObject} />
      <Routes>
        <Route path="/" element={<Home updatesOb={updatesObject} />} />
        <Route path="/shop" element={<Shop updatesOb={updatesObject} />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
