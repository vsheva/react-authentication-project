import { useState, useRef} from 'react';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

const submitHandler =(event)=>{
  event.preventDefault();
  const eneteredEmail = emailInputRef.current.value;
  const eneteredPassword = passwordInputRef.current.value;

  setIsLoading(true);
  let url;
  if (isLogin) {
      url="https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBI82PbewgkJW5SBIDgWtvredDKE-hXGLo"
  } else {
    url="https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBI82PbewgkJW5SBIDgWtvredDKE-hXGLo"
  }

  fetch(url, {
    method:"POST",
    body: JSON.stringify({
      email: eneteredEmail,
      password: eneteredPassword,
      returnSecureToken:true,
    }),
    headers: {
      "Content-Type": "application/json",
    }
  }).then(res=>{
    setIsLoading(false)
    if(res.ok) {
      return res.json();
    } else {
      return res.json().then((data)=>{
        //console.log(data) //{error: {…}}    error: {code: 400, message: 'WEAK_PASSWORD : Password should be at least 6 characters', errors: Array(1)}
        let errorMessage="Authentication failed!"
        /**if(data && data.error && data.error.message) {
          errorMessage=data.error.message;
        }*/

        throw new Error(errorMessage);
      });
    }
  }).then((data)=> {
    console.log(data)
  }).catch((error)=> {
    alert(error.message)
  })

};


  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required  ref={passwordInputRef}/>
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Sending request...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;


/**
 {kind: 'identitytoolkit#VerifyPasswordResponse', localId: 'qlXnvw3CEVfnCzY7DModeAayoOD2', email: 'test@test.com', displayName: '', idToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjFhZjYwYzE3ZTJkNmY4YW…vb1iA8TgUiYXlJ63E0Wc3z8panO6m1lqEJSjhlCoWVsFwtx-g', …}
 displayName: ""
 email: "test@test.com"
 expiresIn: "3600"
 idToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFhZjYwYzE3ZTJkNmY4YWQ1MzRjNDAwYzVhMTZkNjc2ZmFkNzc3ZTYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcmVhY3QtaHR0cC01MzE1OSIsImF1ZCI6InJlYWN0LWh0dHAtNTMxNTkiLCJhdXRoX3RpbWUiOjE2NTk1NjUzODYsInVzZXJfaWQiOiJxbFhudnczQ0VWZm5Delk3RE1vZGVBYXlvT0QyIiwic3ViIjoicWxYbnZ3M0NFVmZuQ3pZN0RNb2RlQWF5b09EMiIsImlhdCI6MTY1OTU2NTM4NiwiZXhwIjoxNjU5NTY4OTg2LCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEB0ZXN0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.rIraOdxt-HmlCHTHY_SghfAggvMYR5q6F1_OUVs0bqKxn1ji_n51lP-gpvfZ_MZw88gfcuQo8hDNKvcucpPR0KNCK6QxmRyU8KQ8keICL9NKEywd-LfNJBS3cKzjzEh_FeFhAA7Kr6sstxoRkXnClPQCxnS8n_F3yUYgfC9Lg8W-h_j94tkoX-1oXPdnnWM-mMJvyTyavNS3Ct-LGwfHVj-xQSY_t3NxQJaehWKSZbkZvO3N6SGnP9v3mikyxA-ZHE28XQlZgjfDrofGwqr9zWUw5k0_yWaM_10kMvb1iA8TgUiYXlJ63E0Wc3z8panO6m1lqEJSjhlCoWVsFwtx-g"
 kind: "identitytoolkit#VerifyPasswordResponse"
 localId: "qlXnvw3CEVfnCzY7DModeAayoOD2"
 refreshToken: "AOEOulZkgCMAe7pLjBAJtzoRmmEfBK_QPr8GZZbWpf8tXfTJ865U80WfWUg5946JcWI4tQNU16TGwpnTjSwbVTstGPqg00ipLnZk_xX8wBiN7FZkX9WJVmdu1DE2EjNBc47OhjM5LjqMOwOqn5VOImXuZ-vA4m8hxq6PmUoZKXR4w7r1VfAGrV5j05hNTgIVAbyUCQNtPxhdQFva65uijovmBKhHUO-TYA"
 registered: true
*/
