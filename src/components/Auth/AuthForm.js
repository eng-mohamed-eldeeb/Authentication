import { useState, useRef, useContext } from "react";
import AuthContext from "../../store/auth-context";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  let url;
  let enteredEmail;
  let enteredPassword;

  const AuthCtx = useContext(AuthContext)


  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
  const [isloading, setIsLoading] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault();
    enteredEmail = emailInputRef.current.value;
    enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);
    if (!isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCcrhXz9zaslHe2aQfaYarp3Y0QarY9ATM";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCcrhXz9zaslHe2aQfaYarp3Y0QarY9ATM";
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMassgae = "ERROR";
            if (data && data.error && data.error.message)
              errorMassgae = data.error.message;
            alert(errorMassgae);
            throw new Error(errorMassgae);
          });
        }
      })
      .then((data) => {
        AuthCtx.login(data.idToken);
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {!isloading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isloading && <p>loading....</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
