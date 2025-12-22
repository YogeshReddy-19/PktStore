import { BrowserRouter, Routes, Route } from "react-router-dom";
import Products from "./Products.jsx";
import Auth from "./Auth";
import Header from "../partials/header.jsx";
import Footer from "../partials/footer.jsx";
import ProductPage from "../components/ProductPage.jsx";
import Search from "../components/Search.jsx";
import Cart from "../components/Cart.jsx";
import Home from "./Home.jsx";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/allP" element={<div><h1 style={{color:'gray'}}>All Products</h1><Products/></div>} />
        <Route path="/product/:id" element={<ProductPage/>}/>
        <Route path="/search" element={<Search />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
