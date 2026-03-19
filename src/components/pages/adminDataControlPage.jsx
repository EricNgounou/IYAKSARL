import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { categories, products } from '../../data';
import { formatDate, createNewProduct } from '../helpers';
import { Overlay } from '../Static';

export default function DataControlPage({ controlOb }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [prodEdit, setProdEdit] = useState({
    curProdEdit: null,
    newProducts: [],
  });
  const [overlay, setOverlay] = useState(false);

  function handleControlSearch(e) {
    e.preventDefault();
  }

  function handleUpdates(e) {
    let isReady;
    let overlayContent = "Can't update! please check all fields and try again.";
    if (prodEdit.curProdEdit) {
      isReady = prodEdit.curProdEdit.isConfirmed;

      const rawProd = products.find((p) => p.id === prodEdit.curProdEdit.id),
        newProd = prodEdit.curProdEdit;

      if (isReady) {
        isReady =
          rawProd.product_price !== newProd.price ||
          rawProd.stock !== newProd.stock ||
          rawProd.img_url !== newProd.imgUrl;
        if (isReady) {
          rawProd.product_price = newProd.price + ' XAF';
          rawProd.stock = newProd.stock;
          rawProd.img_url = newProd.imgUrl;

          overlayContent = 'Updating...';
        }
      }
    } else {
      isReady = prodEdit.newProducts.every((el) => el.isConfirmed === true);
      if (isReady) {
        const newProducts = prodEdit.newProducts.map((prod) => {
          const {
            id,
            name: product_name,
            price,
            category,
            subCategory: sub_category,
            description,
            stock,
            imgUrl: img_url,
          } = prod;
          return {
            id,
            product_name,
            product_price: price + ' XAF',
            category,
            sub_category,
            description,
            stock,
            sales: 0,
            img_url,
            date_mod: new Date().toISOString(),
          };
        });
        setProdEdit({ curProdEdit: null, newProducts: [] });

        products.push(...newProducts);
        overlayContent = 'Updating...';
      }
    }

    setOverlay(overlayContent);

    setTimeout(() => {
      if (isReady) {
        setOverlay('Successfull!');
        setTimeout(() => {
          setOverlay(null);
        }, 2000);
      } else setOverlay(null);
    }, 4000);
  }

  return (
    <section id="control_page">
      <div className="nav_bar">
        <h1 className="label">Data management</h1>
        <ul>
          <NavLink to="/data-control/products">
            <li>Products</li>
          </NavLink>
          <NavLink to="/data-control/orders">
            <li>Orders</li>
          </NavLink>
          <NavLink to="/data-control/users">
            <li>Users</li>
          </NavLink>
          <form id="control_search" onSubmit={handleControlSearch}>
            <input
              type="text"
              placeholder={`Find ${id === 'orders' ? 'an' : 'a'} ${id.slice(
                0,
                -1,
              )}`}
            />
            <button>
              <img src="/loupe.png" alt="Loupe icon" />
            </button>
          </form>

          {id === 'products' && (
            <button
              className="btn_create_prod"
              onClick={(e) => {
                setProdEdit({
                  newProducts: [...prodEdit.newProducts, createNewProduct()],
                  curProdEdit: null,
                });
              }}
            >
              <img src="/plus.png" alt="Plus icon" />
              Create product
            </button>
          )}
        </ul>
        <span
          id="control_exit"
          onClick={(e) => {
            navigate('/');
          }}
        >
          Exit
        </span>
      </div>
      <main id="control_display">
        {id === 'products' && (
          <ProductsControlPage editOb={{ prodEdit, setProdEdit }} />
        )}
        {id === 'orders' && <OrdersControlPage />}
        {id === 'users' && <UsersControlPage />}
        <section id="control_side_display">
          {id === 'products' && (
            <div id="prod_side_box">
              {prodEdit.newProducts.length || prodEdit.curProdEdit ? (
                <>
                  {prodEdit.newProducts.length ? (
                    <>
                      {prodEdit.newProducts.map((p, i) => (
                        <ProductEdit
                          key={i}
                          editOb={{
                            prodEdit,
                            setProdEdit,
                            data: p,
                            index: i,
                          }}
                        />
                      ))}
                      <button
                        className="btn_create_prod"
                        id="btn_plus_prod"
                        onClick={(e) => {
                          setProdEdit({
                            newProducts: [
                              ...prodEdit.newProducts,
                              createNewProduct(),
                            ],
                            curProdEdit: null,
                          });
                        }}
                      >
                        <img src="/plus.png" alt="Plus icon" />
                      </button>
                    </>
                  ) : (
                    <ProductEdit
                      editOb={{
                        prodEdit,
                        setProdEdit,
                        data: prodEdit.curProdEdit,
                      }}
                    />
                  )}

                  <button onClick={handleUpdates} id="prod_side_update_btn">
                    Update
                  </button>
                </>
              ) : (
                <p className="default_message">
                  <span> Select a product to explore </span>
                  or
                  <button
                    className="btn_create_prod"
                    onClick={(e) => {
                      setProdEdit({
                        newProducts: [
                          ...prodEdit.newProducts,
                          createNewProduct(),
                        ],
                        curProdEdit: null,
                      });
                    }}
                  >
                    <img src="/plus.png" alt="Plus icon" />
                    Create product
                  </button>
                </p>
              )}
            </div>
          )}
        </section>
      </main>
      {overlay && (
        <Overlay
          content={
            <div className="control_overlay_mess">
              <p>{overlay}</p>
            </div>
          }
        />
      )}
    </section>
  );
}

function ProductsControlPage(props) {
  const [sortData, setSortData] = useState({
    curCat: 'All',
    curSubCat: null,
    curOption: 'All',
    sortBy: 'Name',
    curProducts() {
      let results =
        this.curCat === 'All'
          ? products
          : products.filter((prod) => prod.category === this.curCat);
      results =
        this.curSubCat && this.curSubCat !== 'All'
          ? results.filter((prod) => prod.sub_category === this.curSubCat)
          : results;
      results =
        this.curOption === 'All'
          ? results
          : this.curOption === 'In stock'
            ? results.filter((prod) => prod.stock >= 1)
            : results.filter((prod) => prod.stock === 0);
      return results.sort((a, b) => {
        switch (this.sortBy) {
          case 'Name':
            return a.product_name.localeCompare(b.product_name);
          case 'Date':
            return new Date(b.date_mod) - new Date(a.date_mod);
          case 'Stock':
            return a.stock - b.stock;
          case 'Sales':
            return b.sales - a.sales;
          default:
            break;
        }
      });
    },
  });
  const handleSort = (e) => {
    const newParams = { ...sortData };
    const targetId = e.target.id;
    const value = e.target.value;
    switch (targetId) {
      case 'prod_control_cat_select':
        newParams.curCat = value;
        newParams.curSubCat = value === 'All' ? null : 'All';
        newParams.curOption = 'All';
        newParams.sortBy = 'Name';
        break;
      case 'prod_control_subcat_select':
        newParams.curSubCat = value;
        newParams.curOption = 'All';
        newParams.sortBy = 'Name';
        break;
      case 'prod_control_option_select':
        newParams.curOption = value;
        newParams.sortBy = 'Name';
        break;
      case 'prod_control_sort_select':
        newParams.sortBy = value;
        break;
      default:
        break;
    }
    setSortData(newParams);
  };

  return (
    <section id="product_control">
      <div className="head">
        <div id="prod_control_select_boxes">
          <div>
            <label htmlFor="prod_control_cat_select">Category :</label>
            <select
              id="prod_control_cat_select"
              className="prod_control_select"
              onChange={handleSort}
              value={sortData.curCat}
            >
              <option value="All">All</option>
              {Array.from(categories.keys()).map((key, i) => (
                <option key={i} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>

          {sortData.curCat !== 'All' && (
            <div>
              <label htmlFor="prod_control_subcat_select">Sub-category :</label>
              <select
                id="prod_control_subcat_select"
                className="prod_control_select"
                onChange={handleSort}
                value={sortData.curSubCat}
              >
                <option value="All">All</option>
                {categories.get(sortData.curCat).map((subCat) => (
                  <option value={subCat.subCatName}>{subCat.subCatName}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="prod_control_option_select"> Option :</label>
            <select
              id="prod_control_option_select"
              className="prod_control_select"
              onChange={handleSort}
              value={sortData.curOption}
            >
              <option value="All">All</option>
              <option value="In stock">In stock</option>
              <option value="Out of stock">Out of stock</option>
            </select>
          </div>

          <div>
            <label htmlFor="prod_control_sort_select"> Sort by :</label>
            <select
              id="prod_control_sort_select"
              className="prod_control_select"
              onChange={handleSort}
              value={sortData.sortBy}
            >
              <option value="Name">Name</option>
              <option value="Date">Date</option>
              <option value="Stock">Stock</option>
              <option value="Sales">Sales</option>
            </select>
          </div>
        </div>
        <span style={{ fontWeight: '600' }}>
          | {sortData.curProducts().length} items
        </span>
      </div>

      <div className="product_prev_desc">
        <span></span>
        <span>Name</span>
        <span>Price</span>
        <span>Sales</span>
        <span>Stock</span>
        <span>Date created</span>
      </div>

      <div className="container">
        {sortData.curProducts().length ? (
          sortData.curProducts().map((prod, i) => (
            <ProductPrev
              key={i}
              data={{
                index: i + 1,
                prodName: prod.product_name,
                prodPrice: prod.product_price,
                sales: prod.sales,
                stock: prod.stock,
                dateMod: prod.date_mod,
                id: prod.id,
              }}
              editOb={props.editOb}
            />
          ))
        ) : (
          <p
            style={{
              textAlign: 'center',
              marginTop: '20px',
              fontWeight: '600',
              color: '#3e035d89',
            }}
          >
            No products found :)
          </p>
        )}
      </div>
    </section>
  );
}

function OrdersControlPage() {
  return (
    <section>
      <h2>This is Orders control page</h2>
    </section>
  );
}

function UsersControlPage() {
  return (
    <section>
      <h2>This is Users control page</h2>
    </section>
  );
}

function ProductEdit({ editOb }) {
  let data = editOb.data;
  const [editData, setEditData] = useState({
    curCat: data.category ?? '--',
    curSubCat: data.subCategory ?? '--',
    curName: data.name ?? '',
    curPrice: data.price ?? '',
    curStock: data.stock ?? '',
    curDesc: data.description ?? [{ property: 'Text', value: '' }],
    imgUrl: data.imgUrl ?? '',
    isConfirmed() {
      return Boolean(
        this.curName &&
          this.curPrice &&
          this.curStock &&
          this.curDesc.length === 1
          ? Boolean(this.curDesc[0].value)
          : this.curDesc
              .slice(1)
              .every(
                (d) =>
                  Boolean(d.property) === true && Boolean(d.value) === true,
              ) && this.imgUrl,
      );
    },
  });

  const handleEditData = (e) => {
    const targetClass = e.target.className;
    const value = e.target.value ?? null;
    let newEditData = { ...editData };

    if (targetClass)
      switch (targetClass) {
        case 'cat_select_edit':
          data.category = value;
          newEditData.curCat = value;
          newEditData.curSubCat = '--';
          break;
        case 'subcat_select_edit':
          data.subCategory = value;
          newEditData.curSubCat = value;
          break;
        case 'prod_name_edit':
          data.name = value;
          newEditData.curName = value;
          break;
        case 'prod_price_edit':
          data.price = value;
          newEditData.curPrice = value;
          break;
        case 'prod_stock_edit':
          data.stock = value;
          newEditData.curStock = value;
          break;
        case 'btn_add_desc':
          newEditData.curDesc.push({
            property: '',
            value: '',
          });
          data.description = newEditData.curDesc;
          break;

        case 'desc_edit':
          const index = e.target.dataset.index;
          const type = e.target.dataset.type;
          newEditData.curDesc[index][type] = value;
          data.description = newEditData.curDesc;
          break;
        case 'btn_delete_desc':
          const delIndex = e.target.dataset.index;
          newEditData.curDesc.splice(delIndex, 1);
          data.description = newEditData.curDesc;
          break;
        case 'prod_img_edit':
          data.imgUrl = value;
          newEditData.imgUrl = value;
          break;
        default:
          break;
      }
    console.log(Boolean(newEditData.imgUrl), newEditData.isConfirmed());

    if (newEditData.curSubCat === '--') {
      newEditData = {
        curCat: newEditData.curCat,
        curSubCat: '--',
        curName: '',
        curPrice: '',
        curStock: '',
        curDesc: [{ property: 'Text', value: '' }],
        imgUrl: '',
        isConfirmed: newEditData.isConfirmed,
      };

      data.category = newEditData.curCat;
      data.subCategory = '';
      data.name = '';
      data.price = '';
      data.stock = '';
      data.description = [{ property: 'Text', value: '' }];
    }
    data.isConfirmed = newEditData.isConfirmed();

    setEditData(newEditData);
  };

  useEffect(() => {
    const updatedData = {
      curCat: data.category ?? '--',
      curSubCat: data.subCategory ?? '--',
      curName: data.name ?? '',
      curPrice: data.price ?? '',
      curStock: data.stock ?? '',
      curDesc: data.description ?? [{ property: 'Text', value: '' }],
      imgUrl: data.imgUrl ?? '',
      isConfirmed() {
        return Boolean(
          this.curName &&
            this.curPrice &&
            this.curStock &&
            this.curDesc.length === 1
            ? Boolean(this.curDesc[0].value)
            : this.curDesc
                .slice(1)
                .every(
                  (d) =>
                    Boolean(d.property) === true && Boolean(d.value) === true,
                ) && this.imgUrl,
        );
      },
    };

    setEditData(updatedData);
  }, [editOb.prodEdit]);

  return (
    <div className="product_edit">
      <div className="prod_edit_bar">
        <span>
          {editOb.prodEdit.curProdEdit?.name ??
            `New Product ${
              editOb.index + 1 + '/' + editOb.prodEdit.newProducts.length
            }`}
        </span>
        <span
          className="close"
          onClick={(e) => {
            editOb.setProdEdit({
              curProdEdit: null,
              newProducts: editOb.prodEdit.newProducts.length
                ? editOb.prodEdit.newProducts.filter((p) => p.id !== data.id)
                : [],
            });
          }}
        >
          <img
            src={`/${editOb.prodEdit.curProdEdit ? 'close' : 'delete'}.png`}
            alt="Close icon"
          />
        </span>
      </div>

      <div className="prod_edit_body">
        <span>
          <label htmlFor={`cat_select_edit_${editOb.index}`}>Category : </label>
          <select
            className="cat_select_edit"
            id={`cat_select_edit_${editOb.index}`}
            value={editData.curCat}
            onChange={handleEditData}
            disabled={Boolean(editOb.prodEdit.curProdEdit)}
          >
            <option value="--">--</option>
            {Array.from(categories.keys()).map((key, i) => (
              <option key={i} value={key}>
                {key}
              </option>
            ))}
          </select>
        </span>
        {editData.curCat !== '--' && (
          <span>
            <label htmlFor={`subcat_select_edit_${editOb.index}`}>
              Sub-category :{' '}
            </label>
            <select
              className="subcat_select_edit"
              id={`subcat_select_edit_${editOb.index}`}
              value={editData.curSubCat}
              onChange={handleEditData}
              disabled={Boolean(editOb.prodEdit.curProdEdit)}
            >
              <option value="--">--</option>
              {categories.get(editData.curCat).map((subCat, i) => (
                <option key={i} value={subCat.subCatName}>
                  {subCat.subCatName}
                </option>
              ))}
            </select>
          </span>
        )}

        {editData.curSubCat !== '--' && editData.curCat !== '--' && (
          <>
            <span>
              <label htmlFor={`prod_name_edit_${editOb.index}`}>Name : </label>
              <input
                type="text"
                className="prod_name_edit"
                id={`prod_name_edit_${editOb.index}`}
                value={editData.curName}
                disabled={Boolean(editOb.prodEdit.curProdEdit)}
                onChange={handleEditData}
              />
            </span>
            <span>
              <label htmlFor={`prod_price_edit_${editOb.index}`}>
                Price :{' '}
              </label>
              <input
                type="text"
                className="prod_price_edit"
                id={`prod_price_edit_${editOb.index}`}
                value={editData.curPrice}
                onChange={handleEditData}
              />
            </span>
            <span>
              <label htmlFor={`prod_stock_edit_${editOb.index}`}>
                Stock :{' '}
              </label>
              <input
                type="text"
                className="prod_stock_edit"
                id={`prod_stock_edit_${editOb.index}`}
                value={editData.curStock}
                onChange={handleEditData}
              />
            </span>
            <div className="prod_desc_edit">
              <label htmlFor={`textDesc_${editOb.index}`}>Description : </label>
              <textarea
                data-index={0}
                data-type="value"
                id={`textDesc_${editOb.index}`}
                className="desc_edit"
                placeholder={`Type text here (${editData.curDesc.length !== 1 ? 'optional' : 'mandatory if no parameter is specified'})`}
                value={editData.curDesc[0].value}
                onChange={handleEditData}
              />

              {editData.curDesc.map((d, i) =>
                i !== 0 ? (
                  <div
                    key={i}
                    className="param"
                    id={`param${i}_${editOb.index}`}
                  >
                    <input
                      data-index={i}
                      data-type="property"
                      id={`property_param${i}_${editOb.index}`}
                      className="desc_edit"
                      placeholder="Property"
                      type="text"
                      value={d.property}
                      onChange={handleEditData}
                    />
                    <span>:</span>
                    <input
                      data-index={i}
                      data-type="value"
                      id={`value_param${i}_${editOb.index}`}
                      className="desc_edit"
                      placeholder="Value"
                      type="text"
                      value={d.value}
                      onChange={handleEditData}
                    />
                    <span
                      data-index={i}
                      className="btn_delete_desc"
                      onClick={handleEditData}
                    >
                      <img
                        data-index={i}
                        className="btn_delete_desc"
                        src="/delete.png"
                        alt="Delete icon"
                      />
                    </span>
                  </div>
                ) : null,
              )}
              <span className="btn_add_desc" onClick={handleEditData}>
                Add a parameter
              </span>
            </div>
            <div>
              <label htmlFor={`prod_img_edit_${editOb.index}`}>
                Images (at least 6 & at most 8):
              </label>
              <div
                className="prod_img_edit"
                id={`prod_img_edit_${editOb.index}`}
              >
                {<img src={`/upload-img.png`} alt={editData.curName} />}
              </div>
            </div>
          </>
        )}
      </div>
      <span className={`edit_confirm ${editData.isConfirmed() && 'confirmed'}`}>
        {editData.isConfirmed() ? 'Confirmed' : 'Unconfirmed'}
      </span>
    </div>
  );
}

function ProductPrev({ data, editOb }) {
  const handleEdit = (e) => {
    const {
      id,
      product_name: name,
      product_price: price,
      category,
      sub_category: subCategory,
      description,
      stock,
      img_url: imgUrl,
    } = products.find((prod) => prod.id === data.id);
    const curProd = {
      id,
      name,
      price,
      category,
      subCategory,
      description,
      stock,
      imgUrl,
    };
    editOb.setProdEdit({
      newProducts: [],
      curProdEdit: curProd,
    });
  };

  return (
    <div
      style={{
        background:
          data.id === editOb.prodEdit.curProdEdit?.id ? '#dfbcff' : 'white',
      }}
      className="product_prev"
      onClick={handleEdit}
    >
      <span className="index">{data.index}</span>
      <span> {data.prodName}</span>
      <span>{data.prodPrice}</span>
      <span className="prod_id">{data.sales}</span>
      <span style={{ color: 'green' }}>{data.stock}</span>
      <span>
        {formatDate(data.dateMod, new Date().toISOString(), false, true)}
      </span>
    </div>
  );
}
