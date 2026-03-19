import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Overlay } from '../Static';
import { orders, orderItems, products, cart } from '../../data';
import { createNewCart } from '../helpers';

export default function CartView({ cartOb }) {
  const [checkout, setCheckout] = useState(false);
  const [totalPrice, setTotalPrice] = useState(cart.order.total_price);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const goToCheckout = (e) => {
    if (cartOb.currentUser) setCheckout(true);
    else cartOb.setOverlay(true);
  };

  useEffect(() => {
    cartOb.setOverlay(false);
  }, [pathname]);

  return (
    <section id="cart_view">
      {!checkout ? (
        <>
          <div className="head">
            <h3>
              <img src="shopping-cart.png" alt="Shopping cart icon" /> Cart
            </h3>
            <span>Total price: {totalPrice} XAF</span>
            <span
              onClick={(e) => {
                navigate(-1);
              }}
            >
              <img src="close.png" alt="Close button" />
            </span>
          </div>

          <div className="items_container">
            {cartOb.cart.length ? (
              <>
                {cartOb.cart.map((item) => (
                  <OrderItems
                    item={item}
                    cartOb={cartOb}
                    setTotalPrice={setTotalPrice}
                  />
                ))}
                <button className="btn_checkout" onClick={goToCheckout}>
                  Go to checkout
                </button>
              </>
            ) : (
              <p className="default_message">
                Your added products will be display here!
              </p>
            )}
          </div>
        </>
      ) : (
        <Checkout setCheckout={setCheckout} cartOb={cartOb} />
      )}
      {cartOb.overlay && (
        <Overlay
          setOverlay={cartOb.setOverlay}
          content=<div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="sign_warning"
          >
            <strong className="message">
              Please sign in to place an order
            </strong>
            <p>
              <Link to="/login">sign in</Link> or
              <Link to="/register">sign up</Link>
            </p>
            <span
              className="back"
              onClick={(e) => {
                cartOb.setOverlay(false);
              }}
            >
              Back
            </span>
          </div>
        />
      )}
    </section>
  );
}

function OrderItems({ item, cartOb, setTotalPrice }) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [subTotal, setSubTotal] = useState(null);
  const product = products.find((prod) => prod.id === item.product_id);

  function removeItem() {
    cartOb.cart.forEach((prod, i) => {
      if (item.id === prod.id) {
        cart.order.total_price = cart.order.total_price - item.sub_total;
        setTotalPrice(cart.order.total_price);
        cartOb.updateCart(i, false);
        return;
      }
    });
    cartOb.setItemCount(cartOb.cart.length);
  }

  useEffect(() => {
    quantity !== item.quantity && setQuantity(item.quantity);
  }, [cartOb.itemCount]);

  useEffect(() => {
    const lastSubValue = item.sub_total;
    item.sub_total = parseInt(product.product_price) * quantity;
    cart.order.total_price =
      cart.order.total_price - lastSubValue + item.sub_total;
    setSubTotal(item.sub_total);
    setTotalPrice(cart.order.total_price);
  }, [quantity]);

  return (
    <div className="order_item">
      <img className="item_img" src={product.img_url} alt="Item image" />

      <div className="item_infos item_name">
        <h4>Name</h4>
        <span> {product.product_name}</span>
      </div>
      <div className="item_infos item_price">
        <h4>Unit price</h4>
        <span>{product.product_price}</span>
      </div>
      <div className="item_infos item_quantity">
        <h4>Quantity</h4>
        <div>
          <span
            className="btn btn_decrease"
            onClick={(e) => {
              quantity === 1 && removeItem();
              quantity > 1 && setQuantity(--item.quantity);
            }}
          >
            <img
              src={`${quantity === 1 ? 'delete' : ' minus'}.png`}
              alt="Minus icon"
              className={`${quantity === 1 ? 'delete' : ''}`}
            />
          </span>
          <span className="quantity">{quantity}</span>
          <span
            className="btn btn_increase"
            onClick={(e) => {
              setQuantity(++item.quantity);
            }}
          >
            <img src="plus.png" alt="Plus icon" />
          </span>
        </div>
      </div>
      <div className="item_infos sub_total">
        <h4>Sub-total</h4>
        <span>{subTotal} XAF</span>
      </div>
    </div>
  );
}

function Checkout({ setCheckout, cartOb }) {
  const navigate = useNavigate();
  const deliveryInp = useRef(null);
  const handlePay = (e) => {
    e.preventDefault();
    cart.order.user_id = cartOb.currentUser.id;
    cart.order.date = new Date().toISOString();
    cart.order.delivery = deliveryInp.current.checked;
    orders.push(cart.order);
    orderItems.push(...cart.items);
    createNewCart(cart);
    cartOb.setItemCount(cart.items.length);
    navigate('/users');
  };
  return (
    <>
      <span
        className="back"
        onClick={(e) => {
          setCheckout(false);
        }}
      >
        &larr; Back
      </span>
      <h2>Choose your payment method</h2>
      <form onSubmit={handlePay}>
        <div style={{ marginLeft: '30px' }}>
          <input ref={deliveryInp} id="delivery" type="checkbox" />
          <label
            htmlFor="delivery"
            style={{ fontWeight: '600', marginLeft: '5px' }}
          >
            Delivery
          </label>
        </div>

        <button
          type="submit"
          style={{
            display: 'block',
            border: 'none',
            background: 'purple',
            color: 'white',
            borderRadius: '5px',
            margin: '0 auto',
            padding: '5px 30px',
            fontSize: '1.3rem',
            cursor: 'pointer',
          }}
        >
          Pay
        </button>
      </form>
    </>
  );
}
