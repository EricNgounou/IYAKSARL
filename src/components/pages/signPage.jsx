import { useRef, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { accounts } from '../../data';
import { generateId, isInputValid } from '../helpers';
import { Overlay } from '../Static';

export default function SignPage({ signOb }) {
  const { pathname } = useLocation();
  const [error, setError] = useState('');
  const [overlayContent, setOverlayContent] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const userInpRef = useRef(null);
  const emailInpRef = useRef(null);
  const passwordInpRef = useRef(null);
  const errorTargets = {
    nameErrRef: useRef(null),
    emailErrRef: useRef(null),
    passwordErrRef: useRef(null),
  };
  const labels = {
    nameLabelRef: useRef(null),
    emailLabelRef: useRef(null),
    passwordLabelRef: useRef(null),
  };
  const labelsArr = [labels.emailLabelRef, labels.passwordLabelRef];
  const errTargets = [errorTargets.emailErrRef, errorTargets.passwordErrRef];
  const inputs = [emailInpRef, passwordInpRef];
  const [digitInput, setDigitInput] = useState(null);
  const navigate = useNavigate();
  const clearInputs = (inputs) => {
    inputs.forEach((inp) => {
      if (!inp.current.value) {
        inp.current.innerHTML = '';
      }
      if (inp.current.value) {
        inp.current.value = '';
      }
    });
  };
  const manageAccount = (e) => {
    e.preventDefault();
    const email = emailInpRef.current.value.trim(),
      password = passwordInpRef.current.value;
    if (pathname === '/register') {
      const username = userInpRef.current.value;

      if (
        !isInputValid(username, 'name', errorTargets.nameErrRef.current) ||
        !isInputValid(email, 'email', errorTargets.emailErrRef.current) ||
        !isInputValid(password, 'password', errorTargets.passwordErrRef.current)
      )
        return;

      const exist = accounts.some((acc) => acc.email === email);

      if (exist) {
        setError('This email is already registered with another account!');
        return;
      }

      accounts.push({ id: generateId(), username, email, password });
      setOverlayContent(<strong> Account successfully created </strong>);
      setTimeout(() => {
        setOverlayContent(null);
        navigate('/login');
      }, 3000);

      // setOverlayContent(
      //   <EmailVerificationBox
      //     process="registration"
      //     task={() => {
      //       accounts.push({ username, email, password });
      //       setOverlayContent(<strong> Account successfully created </strong>);
      //       setTimeout(() => {
      //         setOverlayContent(null);
      //         navigate('/login');
      //       }, 3000);
      //     }}
      //     setDigitInput={setDigitInput}
      //   />
      // );
    } else {
      if (
        !isInputValid(email, 'email', errorTargets.emailErrRef.current) ||
        !isInputValid(password, 'password', errorTargets.passwordErrRef.current)
      )
        return;

      const curAccount = accounts.find(
        (acc) =>
          acc.email === emailInpRef.current.value.trim() &&
          acc.password === passwordInpRef.current.value
      );
      if (curAccount) {
        signOb.setCurrentUser(curAccount);
        navigate('/users');
      }
      // setOverlayContent(
      //   <EmailVerificationBox
      //     process="login"
      //     task={() => {
      //       signOb.setCurrentUser(curAccount);
      //       navigate('/user');
      //     }}
      //     setDigitInput={setDigitInput}
      //   />
      // );
      else setError('Incorrect user email or password.');
    }
  };

  useEffect(() => {
    setError('');

    labelsArr.forEach((l) => {
      l.current.style.top = '50%';
      l.current.style.background = 'transparent';
    });
    clearInputs(errTargets);
    clearInputs(inputs);
  }, [pathname]);

  return (
    <section id="sign-page">
      <span
        className="btn_back"
        onClick={(e) => {
          navigate(-1);
        }}
      >
        &larr;
      </span>
      <h2> {`Sign ${pathname === '/login' ? ' in' : 'up'}`} </h2>
      <form id="sign_form" onSubmit={manageAccount} autoComplete="off">
        {error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <p>
            {pathname === '/login'
              ? 'Enter your email & password.'
              : 'Please fill this form to register. All fields are mandatory!'}
          </p>
        )}

        {pathname === '/register' && (
          <div className="input_field" id="name_field">
            <div>
              <label ref={labels.nameLabelRef} htmlFor="username">
                Name
              </label>
              <input
                ref={userInpRef}
                id="username"
                name="username"
                type="text"
                spellCheck={false}
                required
                onKeyUp={(e) => {
                  const label = labels.nameLabelRef.current;
                  label.style.top = !e.target.value ? '50%' : 0;
                  label.style.background = !e.target.value
                    ? 'transparent'
                    : 'white';
                  label.style.padding = !e.target.value ? 0 : '0 4px';
                  isInputValid(
                    e.target.value.trim(),
                    'name',
                    errorTargets.nameErrRef.current
                  );
                }}
              />
            </div>
            <span
              ref={errorTargets.nameErrRef}
              id="name_error"
              style={{ color: 'red' }}
            ></span>
          </div>
        )}

        <div className="input_field" id="email_field">
          <div>
            <label ref={labels.emailLabelRef} htmlFor="email">
              Email
            </label>
            <input
              ref={emailInpRef}
              id="email"
              type="email"
              name="email"
              spellCheck={false}
              required
              onKeyUp={(e) => {
                const label = labels.emailLabelRef.current;
                label.style.top = !e.target.value ? '50%' : 0;
                label.style.background = !e.target.value
                  ? 'transparent'
                  : 'white';
                label.style.padding = !e.target.value ? 0 : '0 4px';
                isInputValid(
                  e.target.value,
                  'email',
                  errorTargets.emailErrRef.current
                );
              }}
            />
          </div>
          <span
            ref={errorTargets.emailErrRef}
            id="email_error"
            style={{ color: 'red' }}
          ></span>
        </div>

        <div className="input_field" id="password_field">
          <div>
            <label ref={labels.passwordLabelRef} htmlFor="password">
              Password
            </label>
            <input
              ref={passwordInpRef}
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              spellCheck={false}
              required
              onKeyUp={(e) => {
                const label = labels.passwordLabelRef.current;
                label.style.top = !e.target.value ? '50%' : 0;
                label.style.background = !e.target.value
                  ? 'transparent'
                  : 'white';
                label.style.padding = !e.target.value ? 0 : '0 4px';
                isInputValid(
                  e.target.value.trim(),
                  'password',
                  errorTargets.passwordErrRef.current
                );
              }}
            />
            <span
              id="show_password"
              onClick={(e) => {
                setShowPassword(!showPassword);
              }}
            >
              <img
                src={`eye_${showPassword ? 'opened' : 'closed'}.png`}
                alt="Eye opened"
              />
            </span>
          </div>
          <span
            ref={errorTargets.passwordErrRef}
            id="password_error"
            style={{ color: 'red' }}
          ></span>
        </div>

        <button id="btn_submit">
          {pathname === '/login' ? ' Login' : 'Register'}
        </button>
      </form>

      {pathname === '/login' ? (
        <p>
          Not having an account yet? <br />
          <Link to="/register" className="label_sign">
            Sign up
          </Link>
        </p>
      ) : (
        <Link to="/login" className="label_sign">
          Back to Login space
        </Link>
      )}
      {overlayContent && (
        <Overlay
          content=<div className="sign_popup_box">{overlayContent}</div>
          digitInput={digitInput}
        />
      )}
    </section>
  );
}

function EmailVerificationBox({ process, task, setDigitInput }) {
  const [error, setError] = useState('');
  const [digitCode, setDigitCode] = useState('');

  const digitInputsRef = {
    inputRef1: useRef(null),
    inputRef2: useRef(null),
    inputRef3: useRef(null),
    inputRef4: useRef(null),
    inputRef5: useRef(null),
    inputRef6: useRef(null),
  };

  const handleInput = (e) => {
    if (isNaN(+e.target.value)) {
      e.target.value = '';
      return;
    }
    setDigitCode(digitCode + e.target.value);
  };

  const handleErase = (e) => {
    if (e.key === 'Backspace') {
      setDigitCode(digitCode.slice(0, -1));
    }
  };

  useEffect(() => {
    if (digitCode.length !== 6) {
      const focusedInp =
        digitInputsRef[`inputRef${digitCode.length ? digitCode.length + 1 : 1}`]
          .current;
      focusedInp.value = '';
      focusedInp.focus();
      setDigitInput(focusedInp);
    }
  }, [digitCode]);

  return (
    <>
      <strong>
        A 6-digit verification code has been sent to your email. Enter the code
        to complete the {process} process.
      </strong>

      <div className="code_fields">
        <input
          ref={digitInputsRef.inputRef1}
          id="digit_1"
          type="text"
          onChange={handleInput}
          readOnly={digitCode.length + 1 !== 1}
          spellCheck={false}
        />

        <input
          ref={digitInputsRef.inputRef2}
          id="digit_2"
          type="text"
          onChange={handleInput}
          onKeyDown={handleErase}
          readOnly={digitCode.length + 1 !== 2}
          spellCheck={false}
        />

        <input
          ref={digitInputsRef.inputRef3}
          id="digit_3"
          type="text"
          onChange={handleInput}
          onKeyDown={handleErase}
          readOnly={digitCode.length + 1 !== 3}
          spellCheck={false}
        />

        <input
          ref={digitInputsRef.inputRef4}
          id="digit_4"
          type="text"
          onChange={handleInput}
          onKeyDown={handleErase}
          readOnly={digitCode.length + 1 !== 4}
          spellCheck={false}
        />

        <input
          ref={digitInputsRef.inputRef5}
          id="digit_5"
          type="text"
          onChange={handleInput}
          onKeyDown={handleErase}
          readOnly={digitCode.length + 1 !== 5}
          spellCheck={false}
        />
        <input
          ref={digitInputsRef.inputRef6}
          id="digit_6"
          type="text"
          onChange={handleInput}
          onKeyDown={handleErase}
          disabled={digitCode.length + 1 !== 6}
          spellCheck={false}
        />
      </div>

      {error && <p style={{ color: 'red' }}>Wrong code</p>}
    </>
  );
}
