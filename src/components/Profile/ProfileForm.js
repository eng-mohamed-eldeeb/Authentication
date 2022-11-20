import classes from './ProfileForm.module.css';
import { useRef } from 'react';
import { useContext } from 'react';
import AuthContext from '../../store/auth-context';
import { useHistory } from 'react-router-dom';

const ProfileForm = () => {
  //vars
  const newPasswordInputRef = useRef();
  const AuthCtx = useContext(AuthContext)
  const history = useHistory();

  const submitHnadler =e =>{
    e.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;
    
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCcrhXz9zaslHe2aQfaYarp3Y0QarY9ATM',
    {
      method: 'POST',
      body: JSON.stringify({
        idToken: AuthCtx.token,
        password: enteredNewPassword,
        returnSecureToken: false
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      history.replace('/')
    })
  }
  return (
    <form className={classes.form} onSubmit={submitHnadler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength='7' ref={newPasswordInputRef}/>
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
