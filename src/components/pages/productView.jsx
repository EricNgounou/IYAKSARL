import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { products } from '../../data';

export default function ProductView({ updatesOb }) {
  const { pathname } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [showImages, setShowImages] = useState(false);
  const [product, setProduct] = useState(
    products.find((prod) => prod.id === id)
  );
  const [added, setAdded] = useState(
    updatesOb.cart.some((item) => item.product_id === product.id)
  );

  useEffect(() => {
    setProduct(products.find((prod) => prod.id === id));
  }, [pathname]);

  return (
    <div className={`${showImages ? 'single_column' : ''}`} id="product_view">
      <div className="head">
        <h2> {product.product_name}</h2>
        <span
          onClick={(e) => {
            if (showImages) {
              setShowImages(false);
              return;
            }
            navigate(-1);
          }}
        >
          &larr; Back
        </span>
      </div>

      <figure className={`${showImages ? 'scroll' : ''}`}>
        <img
          className="product_image"
          src={product.img_url}
          alt="Product image"
          onClick={(e) => {
            setShowImages(true);
          }}
        />

        {showImages && (
          <>
            <img src="/h-bg.jpg" alt="Image preview" />
            <img src="/h-bg.jpg" alt="Image preview" />
            <img src="/h-bg.jpg" alt="Image preview" />
            <img src="/h-bg.jpg" alt="Image preview" />
            <img src="/h-bg.jpg" alt="Image preview" />
            <img src="/h-bg.jpg" alt="Image preview" />
            <img src="/h-bg.jpg" alt="Image preview" />
          </>
        )}

        {!showImages && (
          <figcaption className="image_prev">
            <span>
              <img src="/h-bg.jpg" alt="Image preview" />
            </span>
            <span>
              <img src="/h-bg.jpg" alt="Image preview" />
            </span>
            <span>
              <img src="/h-bg.jpg" alt="Image preview" />
            </span>
            <span>
              <img src="/h-bg.jpg" alt="Image preview" />
            </span>
            <span>
              <img src="/h-bg.jpg" alt="Image preview" />
            </span>
          </figcaption>
        )}
      </figure>

      {!showImages && (
        <div className="product_control">
          <p>A blue nike shoes{product.description}</p>
          <span>{product.product_price} XAF</span>
          <p>
            In stock : <span> {product.stock}50</span>
          </p>
          <p>
            Sales : <span>10{product.sales}</span>
          </p>

          <button
            className={`btn_add ${added ? 'added' : ''}`}
            onClick={(e) => {
              updatesOb.updateAddProduct(product, added, setAdded);
            }}
          >
            {`Add${added ? 'ed' : ' to basket'}`}
          </button>
        </div>
      )}
    </div>
  );
}
