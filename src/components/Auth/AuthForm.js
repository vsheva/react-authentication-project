import {useState, useRef, useContext} from 'react';
import {useHistory} from "react-router-dom";
import classes from './AuthForm.module.css';
import AuthContext from "../../store/auth-context";

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const history = useHistory(); //redirection
    const authCtx = useContext(AuthContext)

    const switchAuthModeHandler = () => {
        setIsLogin((prevState) => !prevState);
    };


    const submitHandler = (event) => {
        event.preventDefault();
        const eneteredEmail = emailInputRef.current.value;
        const eneteredPassword = passwordInputRef.current.value;
        setIsLoading(true);

        let url;
        if (isLogin) {
            url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBI82PbewgkJW5SBIDgWtvredDKE-hXGLo"
        } else {
            url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBI82PbewgkJW5SBIDgWtvredDKE-hXGLo"
        }

        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                email: eneteredEmail,
                password: eneteredPassword,
                returnSecureToken: true,
            }),
            headers: {
                "Content-Type": "application/json",
            }
        }).then(res => {
            setIsLoading(false)
            if (res.ok) {
                return res.json();
            } else {
                return res.json().then((data) => {
                    //console.log(data) //{error: {…}}    error: {code: 400, message: 'WEAK_PASSWORD : Password should be at least 6 characters', errors: Array(1)}
                    let errorMessage = "Authentication failed!"
                    /**if(data && data.error && data.error.message) {
          errorMessage=data.error.message;
        }*/

                    throw new Error(errorMessage);
                });
            }
        }).then((data) => {

            /** console.log("data in AuthForm", data)
             {
       displayName: ""
       email: "test@test.com"
       expiresIn: "3600"
       idToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjA2M2E3Y2E0M2MzYzc2MDM2NzRlZGE0YmU5NzcyNWI3M2QwZGMwMWYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcmVhY3QtaHR0cC01MzE1OSIsImF1ZCI6InJlYWN0LWh0dHAtNTMxNTkiLCJhdXRoX3RpbWUiOjE2NTk3MTE5NDUsInVzZXJfaWQiOiJxbFhudnczQ0VWZm5Delk3RE1vZGVBYXlvT0QyIiwic3ViIjoicWxYbnZ3M0NFVmZuQ3pZN0RNb2RlQWF5b09EMiIsImlhdCI6MTY1OTcxMTk0NSwiZXhwIjoxNjU5NzE1NTQ1LCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEB0ZXN0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.DSjnRdDMq4WOx1-meAfZXW7JNxmS6_imIThR_spwbW3W_rXXMnRaHPaNOtlO5ng3atfK9ol0MkAxG_HU4BbwtjzrLClWG6tNtZ1495jZzIqQBVeP3sjQwr0XpHZQkW1I7Lp8fllGTiDkHiX4I5huJ_QBPqgr8PP6gO9ceCOBcVlmQqta0pUISojtX8b37J6ds-iQqHogX1Lr037uKGjdO2Rkncf2DBmG1o9_2UF3Pf1UqD9UGvkYBbNZF3Lme0YAWHEmzbQu44C3ZemZksCbL7y58FE0cP5MDFbUaDaFNpoBzlbOV2aGtFMHecku9eGu9vnggQMPvtcVA6J5W5wK_g"
       kind: "identitytoolkit#VerifyPasswordResponse"
       localId: "qlXnvw3CEVfnCzY7DModeAayoOD2"
       refreshToken: "AOEOulbZzVAIucfTosK7FdkYOwO9vS0yppklJwmDQ5IKy0_WhRCHzw2e9SN4m7QIIgzB5uvSjtijEpukyrbxAu1-V6mI2t44l7fwpww0A1lEnNzNA9mScF-7RwHkbCFAFuKkGKAMLY93lMfEoE1U9zt2bkWfkkCvgOl47j5BWxDVEvSGgMJf8QFU76NSFWmmdaK0D2EAyBQyUC-FBMsigpDqUKBzlZQWdw"
        registered: true
    }*/

            history.replace("/"); //redirection

            const expirationTimeInMs = new Date().getTime() + (+data.expiresIn * 1000); //1659712275925 + 3600 *1000
            const expirationTime = new Date(expirationTimeInMs);

            // console.log("beforeRequest", localStorage.getItem("token"))//token
            authCtx.login(data.idToken, expirationTime)//* ???
            //console.log("afterRequest", localStorage.getItem("token"))//token

        }).catch((error) => {
            alert(error.message)
        })

    };


    return (
        <section className={classes.auth}>
            <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
            <form onSubmit={submitHandler}>
                <div className={classes.control}>
                    <label htmlFor='email'>Your Email</label>
                    <input type='email' id='email' required ref={emailInputRef}/>
                </div>
                <div className={classes.control}>
                    <label htmlFor='password'>Your Password</label>
                    <input type='password' id='password' required ref={passwordInputRef}/>
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

//console.log("history ", history)
/**  {length: 7, action: 'POP', location: {…}, createHref: ƒ, push: ƒ, …}
 action: "REPLACE"
 block: ƒ block(prompt)
 createHref: ƒ createHref(location)
 go: ƒ go(n)
 goBack: ƒ goBack()
 goForward: ƒ goForward()
 length: 7
 listen: ƒ listen(listener)
 location: {pathname: '/auth', search: '', hash: '', state: undefined, key: '4sdwh9'}
 push: ƒ push(path, state)
 replace: ƒ replace(path, state)
 [[Prototype]]: Object
 */

