import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { NavBar } from './components/Static';
// import { Home, Articles, Blog, About } from "./components/pages";
import Home from './components/pages/Home';
import Articles from './components/pages/Articles';
import Blog from './components/pages/Blog';
import About from './components/pages/About';
import ScrollToTop from './components/ScrollToTop';
import './App.css';
import './styles/Articles.css';

function App() {
  return (
    <>
      <ScrollToTop />
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </>
  );
}

function Footer() {
  return <footer></footer>;
}

export default App;
