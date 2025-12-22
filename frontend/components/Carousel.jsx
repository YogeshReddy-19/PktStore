import React from "react";
import { useNavigate } from "react-router-dom";
import "../src/styles/carousel.css";

const carouselItems = [
  { id: 1, src: "/carouseli1.png", link: "/product/1" },
  { id: 2, src: "/carouseli2.png", link: "/product/2" },
  { id: 3, src: "/carouseli3.png", link: "/product/8" },
];

function Carousel() {
  const navigate = useNavigate();

  const handleImageClick = (link) => {
    navigate(link);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-track">
        
        {carouselItems.map((item, index) => (
          <img
            key={`original-${index}`}
            src={item.src}
            alt={`product-${item.id}`}
            onClick={() => handleImageClick(item.link)}
            style={{ cursor: "pointer" }} 
          />
        ))}

        {carouselItems.map((item, index) => (
          <img
            key={`duplicate-${index}`}
            src={item.src}
            alt={`product-${item.id}`}
            onClick={() => handleImageClick(item.link)}
            style={{ cursor: "pointer" }}
          />
        ))}
        
      </div>
    </div>
  );
}

export default Carousel;