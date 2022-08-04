import React, {useState} from 'react';

const AuthContext = React.createContext({
    token: "",
    isLoggedIn: false,
    login: (token) => {
    },
    logout: () => {
    }
});

 export const AuthContextProvider = (props) => {
    const [token, setIsToken] = useState(null)

    const userIsLoggedIn = !!token;

    const loginHandler = (token) => {
        setIsToken(token)
    }

    const logoutHandler = () => {
        setIsToken(null)
    }

    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
    }

    return <AuthContext.Provider  value={contextValue}>
        {props.children}
    </AuthContext.Provider>
}


export default AuthContext;