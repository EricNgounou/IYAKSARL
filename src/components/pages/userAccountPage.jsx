import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Overlay } from '../Static';
import { useState, useEffect, useRef } from 'react';
import { formatDate, formatTime, isInputValid } from '../helpers';
import { orders, orderItems, products } from '../../data';

export default function AccountPage({ userOb }) {
  const { currentUser: user } = userOb;
  const dateLabMemo = new Map();
  const { pathname } = useLocation();
  const errorTargets = {
    oldPassErrRef: useRef(null),
    newPassErrRef: useRef(null),
    nameErrRef: useRef(null),
  };
  const editInputsRef = {
    nameREf: useRef(null),
    oldPassREf: useRef(null),
    newPassRef: useRef(null),
  };
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [overlayContent, setOverlayContent] = useState('');
  const [openEdit, setOpenEdit] = useState({ main: false, passEdit: false });
  const [showPassword, setShowPassword] = useState({ old: false, new: false });
  const [userOrders, setUserOrders] = useState(
    orders.filter((order) => order.user_id === user?.id)
  );
  const nameLabelRef = useRef(null);

  const handleOldPass = (e) => {
    isInputValid(
      e.target.value.trim(),
      'password',
      errorTargets.oldPassErrRef.current
    );
  };
  const handleNewPass = (e) => {
    isInputValid(
      e.target.value,
      'password',
      errorTargets.newPassErrRef.current
    );
  };
  const handleName = (e) => {
    const label = nameLabelRef.current;
    label.style.top = !e.target.value ? '50%' : '-2px';

    isInputValid(
      e.target.value.trim(),
      'name',
      errorTargets.nameErrRef.current
    );
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const name = editInputsRef.nameREf.current.value.trim(),
      oldPass = editInputsRef.oldPassREf.current?.value,
      newPass = editInputsRef.newPassRef.current?.value;
    if (!name && !oldPass && !newPass) return;

    const updates = new Map();

    if (name && name !== user.username) {
      if (!isInputValid(name, 'name', errorTargets.nameErrRef.current)) {
        return;
      }
      updates.set('username', name);
    }

    if (oldPass && newPass) {
      if (
        !isInputValid(
          oldPass,
          'password',
          errorTargets.oldPassErrRef.current
        ) ||
        !isInputValid(newPass, 'password', errorTargets.newPassErrRef.current)
      ) {
        return;
      }
      if (oldPass !== user.password) {
        setError('Old password is not valid.');
        return;
      }
      if (oldPass === newPass) {
        setError('Cannot update the same password.');
        return;
      }
      updates.set('password', newPass);
    }

    if (updates.size) {
      for (const [key, value] of updates) {
        user[key] = value;
      }
      userOb.setCurrentUser({ ...user });
      setError('');
      setOpenEdit({ main: false, passEdit: false });
      console.log(overlayContent);
      setOverlayContent(
        <p
          style={{
            fontWeight: 600,
            padding: '20px',
            background: 'white',
            borderRadius: '10px',
          }}
        >
          Updates have been successfully submitted!
        </p>
      );
      setTimeout(() => {
        setOverlayContent('');
        console.log(userOb.currentUser);
      }, 3000);
    } else
      setError(
        'Cannot submit updates. Check if the update information are present :)'
      );
  };

  function handleSortOrders(e) {
    const value = e.target.value;
    switch (value) {
      case 'amount':
        setUserOrders(
          [...userOrders].sort((a, b) => b.totalPrice - a.totalPrice)
        );
        break;
      case 'item':
        setUserOrders(
          [...userOrders].sort((a, b) => b.items.length - a.items.length)
        );
        break;

      default:
        setUserOrders([...userOrders].sort((a, b) => b.date - a.date));
        break;
    }
  }

  useEffect(() => {
    setError('');
    if (openEdit.passEdit === true) {
      setShowPassword({ old: false, new: false });
    }
  }, [openEdit]);

  useEffect(() => {
    if (userOrders.length)
      setUserOrders(
        userOrders
          .map((order) => {
            const items = orderItems
              .filter((item) => order.id === item.order_id)
              .map((item) => {
                const product = products.find(
                  (prod) => prod.id === item.product_id
                );
                const {
                    product_name: name,
                    product_price: price,
                    img_url: img,
                  } = product,
                  {
                    quantity,
                    sub_total: subTotal,
                    product_id: productId,
                  } = item;
                return { productId, name, price, img, quantity, subTotal };
              });
            const { total_price: totalPrice, status, delivery, date } = order;
            return { items, totalPrice, status, delivery, date };
          })
          .sort((a, b) => b.date - a.date)
      );
  }, []);

  return (
    <section id="account_page">
      <div id="profile_infos">
        <div id="profile_index">
          <span id="profile">
            {user?.profile_picture ? (
              <img src={user.profile_picture} alt="User picture" />
            ) : (
              user?.username.slice(0, 1).toUpperCase()
            )}
          </span>
          <div id="user_infos">
            <p id="user_name">{user?.username}</p>
            <p id="user_email">{user?.email}</p>
          </div>
        </div>

        <div id="profile_edit">
          <span
            className="option"
            id="edit_option"
            onClick={(e) => {
              setOpenEdit({
                main: !openEdit.main,
                passEdit: false,
              });
            }}
          >
            <img src="edit.png" alt="Edit icon" />
            Edit profile
            <span
              className="option_arr"
              style={{
                rotate: openEdit.main ? '270deg' : '90deg',
              }}
            >
              &#8250;
            </span>
          </span>

          {openEdit.main && (
            <form id="update_form" onSubmit={handleUpdate}>
              {error && (
                <p id="main_error" style={{ color: 'red' }}>
                  {error}
                </p>
              )}
              <span id="picture_edit">
                {user.profile_picture ? (
                  <img src={user?.profile_picture} alt="User picture" />
                ) : (
                  user.username.slice(0, 1).toUpperCase()
                )}
                <span id="pict_overlay">
                  <img src="edit.png" alt="Edit icon" />
                </span>
              </span>

              <div id="name_edit">
                <div id="name_edit_field">
                  <label ref={nameLabelRef} htmlFor="name">
                    Edit name
                  </label>
                  <input
                    ref={editInputsRef.nameREf}
                    name="name"
                    type="text"
                    onKeyUp={handleName}
                    defaultValue={user.username}
                  />
                </div>
                <span
                  ref={errorTargets.nameErrRef}
                  id="name_error"
                  style={{ color: 'red' }}
                ></span>
              </div>

              <div id="password_edit">
                <span
                  className="option"
                  onClick={(e) => {
                    setOpenEdit({
                      main: openEdit.main,
                      passEdit: !openEdit.passEdit,
                    });
                  }}
                >
                  Change password
                  <span
                    className="option_arr"
                    style={{
                      rotate: openEdit.passEdit ? '270deg' : '90deg',
                    }}
                  >
                    &#8250;
                  </span>
                </span>

                {openEdit.passEdit && (
                  <>
                    <div>
                      <div id="old_password">
                        <input
                          ref={editInputsRef.oldPassREf}
                          type={showPassword.old ? 'text' : 'password'}
                          placeholder="Old password"
                          onKeyUp={handleOldPass}
                        />
                        <span
                          id="show_password"
                          onClick={(e) => {
                            setShowPassword({
                              old: !showPassword.old,
                              new: showPassword.new,
                            });
                          }}
                        >
                          <img
                            src={`eye_${
                              showPassword.old ? 'opened' : 'closed'
                            }.png`}
                            alt="Eye opened"
                          />
                        </span>
                      </div>
                      <span
                        ref={errorTargets.oldPassErrRef}
                        className="error"
                        style={{ color: 'red' }}
                      ></span>
                    </div>

                    <div>
                      <div id="new_password">
                        <input
                          ref={editInputsRef.newPassRef}
                          type={showPassword.new ? 'text' : 'password'}
                          placeholder="New password"
                          onKeyUp={handleNewPass}
                        />
                        <span
                          id="show_password"
                          onClick={(e) => {
                            setShowPassword({
                              old: showPassword.old,
                              new: !showPassword.new,
                            });
                          }}
                        >
                          <img
                            src={`eye_${
                              showPassword.new ? 'opened' : 'closed'
                            }.png`}
                            alt="Eye opened"
                          />
                        </span>
                      </div>
                      <span
                        ref={errorTargets.newPassErrRef}
                        className="error"
                        style={{ color: 'red' }}
                      ></span>
                    </div>
                  </>
                )}
              </div>

              <button type="submit">Update</button>
            </form>
          )}
        </div>
        <span
          className="option"
          id="btn_logout"
          onClick={(e) => {
            setOverlayContent(
              <div className="logout_warning">
                <p>Confirm login out</p>
                <div>
                  <span
                    onClick={(e) => {
                      setOverlayContent('');
                    }}
                  >
                    Cancel
                  </span>
                  <span
                    onClick={(e) => {
                      userOb.setCurrentUser(null);
                      setOverlayContent('');
                      navigate('/');
                    }}
                  >
                    Confirm
                  </span>
                </div>
              </div>
            );
          }}
        >
          <img src="exit.png" alt="Logout icon" />
          Log out
        </span>
      </div>

      <div id="order_history">
        <div className="head">
          <h2>Order history</h2>
          <div id="sort_orders">
            <label htmlFor="select_type">Sort by : </label>
            <select id="select_type" onChange={handleSortOrders}>
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="item">Item</option>
            </select>
          </div>

          <span>
            {userOrders.length < 10 && userOrders.length !== 0
              ? `${userOrders.length}`.padStart(2, 0) + ' '
              : userOrders.length + ' '}
            Order(s)
          </span>
        </div>
        <div id="orders_container">
          {userOrders.length ? (
            userOrders.map((order, i) => (
              <Order key={i} data={order} dateLabMemo={dateLabMemo} />
            ))
          ) : (
            <p className="default_message">Your order history is empty</p>
          )}
        </div>
      </div>
      {overlayContent && <Overlay content={overlayContent} />}
    </section>
  );
}

// Orders component
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
function Order({ data, dateLabMemo }) {
  if (!data.items) return null;
  const orderRef = useRef(null);
  const [labDate, setLabDate] = useState(null);
  const [openOrder, setOpenOrder] = useState(false);
  const now = new Date();

  useEffect(() => {
    const lab = formatDate(data.date, now.toISOString());
    if (!dateLabMemo.has(lab)) {
      setLabDate(lab);
      dateLabMemo.set(lab, lab);
    }
  }, []);

  return (
    <>
      {labDate && <p className="lab_date">{labDate}</p>}
      <div ref={orderRef} className="order">
        <div
          className="order_prev"
          onClick={(e) => {
            setOpenOrder(!openOrder);
          }}
        >
          <span className="items_count">{data.items.length} item(s)</span>
          <span className="items_amount">{data.totalPrice} XAF</span>
          <span className="date">{formatTime(data.date)}</span>
          <span className="status_prev">{data.status}</span>
          <span
            className="down_arr"
            style={{ display: openOrder ? 'none' : 'block' }}
          ></span>
        </div>
        {openOrder && (
          <>
            <div className="order_infos">
              <span>
                <span className="label">Ordered on : </span>
                {formatDate(data.date, now.toISOString(), true)} at
                {formatTime(data.date, true)}
              </span>
              <span>
                <span className="label">Status : </span> {data.status}
              </span>
              <span>
                <span className="label">Acquiring method : </span>
                {data.delivery ? 'Delevery' : 'Moving'}
              </span>
            </div>
            {data.items.map((item, i) => {
              return (
                <div className="items_infos">
                  <span className="item_index">
                    Product {`${i + 1}/${data.items.length}`}
                  </span>
                  <img src={item.img} alt={item.name} />
                  <p>
                    <span className="label">Name : </span> {item.name}
                  </p>
                  <p>
                    <span className="label">Unit Price : </span> {item.price}{' '}
                    XAF
                  </p>
                  <p>
                    <span className="label">Quantity : </span> {item.quantity}
                  </p>
                  <p>
                    <span className="label">Sub-total : </span> {item.subTotal}{' '}
                    XAF
                  </p>
                  <Link to={`/products/${item.productId}`}>View Product</Link>
                </div>
              );
            })}
          </>
        )}

        {openOrder && (
          <span
            className="btn_close"
            onClick={(e) => {
              setOpenOrder(false);
            }}
          >
            Close
          </span>
        )}
      </div>
    </>
  );
}
