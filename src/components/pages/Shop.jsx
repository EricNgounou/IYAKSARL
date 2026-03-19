// import { Route, Routes } from 'react-router-dom';
import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { categories, products } from '../../data';

let barInfo = {
  isBarHidden: false,
  isMenuOpened: false,
  size: 0,
};

export const setBarInfo = (infos) => {
  barInfo = infos;
};

let fullDisplay = true;
export const setFullDisplay = (val) => {
  fullDisplay = val;
};

export default function Shop({ updatesOb }) {
  const { pathname } = useLocation();
  const { id } = useParams();

  const categoryName =
    id && id[0].toUpperCase() + id.slice(1).replaceAll('-', ' ');
  const [openSideBar, setOpenSideBar] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [headSticky, setHeadSticky] = useState(false);
  const hStickyStyle = {
    transform: `translateY(${barInfo.size}px)`,
    transition: `transform 0.5s`,
  };
  const selectEl = useRef(null);

  const [curCategory, setCurCategory] = useState(
    id ? products.filter((prod) => prod.category === categoryName) : null
  );

  const handleCategory = (e) => {
    let newCategory;
    const value = e.target.value;
    if (value === 'All') {
      newCategory = products.filter((prod) => prod.category === categoryName);
    } else
      newCategory = products.filter(
        (prod) => prod.category === categoryName && prod.sub_category === value
      );

    setCurCategory(newCategory);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (id) {
      setCurCategory(products.filter((prod) => prod.category === categoryName));
      selectEl.current.selectedIndex = 0;
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setHeadSticky(scrollY > 95 ? true : false);
  }, [scrollY]);

  return (
    <section className="shop_page">
      <div
        className={`art_head ${headSticky && fullDisplay ? 'sticky' : ''}`}
        style={headSticky && fullDisplay ? hStickyStyle : {}}
      >
        <span
          className="sb_btn"
          onClick={(e) => {
            setOpenSideBar(!openSideBar);
          }}
        >
          <img src="/shopping-bag.png" alt="shopping-bag icon" />
          <span className={openSideBar ? 'close' : ''}>&#8250;</span>
        </span>

        <span
          id="category_index"
          onClick={(e) => {
            setOpenSideBar(!openSideBar);
          }}
        >
          {categoryName ? categoryName : 'Categories'}
        </span>

        {id && (
          <select ref={selectEl} id="category_select" onChange={handleCategory}>
            <option value="All">All</option>
            {categories.get(categoryName).map((subCat) => {
              return (
                <option value={subCat.subCatName}>{subCat.subCatName}</option>
              );
            })}
          </select>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            // console.log(e);
          }}
          id="search_field"
          action=""
        >
          <input
            id="search_box"
            type="text"
            placeholder="Search products ..."
          />
          <button className="btn_search" type="submit">
            <img src="/loupe.png" alt="Search icon" />
          </button>
        </form>

        <ul id="category_options">
          <li>Option 1</li>
          <li>Option 2</li>
          <li>Option 3</li>
          <li>Option 4</li>
          <li>Option 5</li>
        </ul>

        <ul
          className={`side_bar ${openSideBar ? '' : 'closed'}`}
          onMouseLeave={(e) => {
            openSideBar === true && setOpenSideBar(false);
          }}
        >
          <h3 className="sb_head">All categories</h3>
          <div>
            {Array.from(categories.keys()).map((c) => (
              <NavLink to={`/shop/${c.replaceAll(' ', '-').toLowerCase()}`}>
                {c}
                <span></span>
              </NavLink>
            ))}
          </div>
        </ul>
      </div>

      <section id="shop_ads">
        <div className="ads">
          <h2>On sale</h2>
        </div>

        <div className="ads">
          <h2>Recommended for you</h2>
        </div>

        <div className="ads">
          <h2>Popular</h2>
        </div>
      </section>

      {id && (
        <section className="category">
          {curCategory?.map((prod, i) => {
            return <Product product={prod} updatesOb={updatesOb} />;
          })}
        </section>
      )}
    </section>
  );
}

function Product({ product, updatesOb }) {
  const added = updatesOb.cart.some((i) => i.product_id === product.id);
  const [isAdded, setIsAdded] = useState(added);
  (function () {
    if (isAdded !== added) setIsAdded(added);
  })();

  return (
    <div className="product_card">
      <Link key={product.id} to={`/products/${product.id}`} className="product">
        <img src={product.img_url}></img>
      </Link>
      <div className="prod_control">
        <div className="product_infos">
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="product_name"
          >
            {product.product_name}
          </Link>
          <p className="product_price">{product.product_price}</p>
          <p className="in_stock">
            In stock : <span>{product.stock} </span>
          </p>
          <p className="sales">
            Sales : <span> {product.sales}</span>
          </p>
        </div>
        <button
          className={`btn_add ${isAdded ? 'added' : ''}`}
          onClick={(e) => {
            updatesOb.updateAddProduct(product, isAdded, setIsAdded);
          }}
        >
          {`Add${isAdded ? 'ed' : ' to basket'}`}
        </button>
      </div>
    </div>
  );
}
