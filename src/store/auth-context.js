import React, { useState } from 'react';
const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {}
})

export const AuthConetextProvider = (props) => {
    const [token, setToken] = useState(null)


    const loginHandler = (token) => {
        setToken(token)
    };
    const logoutHandler = () => {
        setToken(null)
    };

    const userIsLoggedIn = !!token;

    const contextVlaue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler

    }

    return <AuthContext.Provider value={contextVlaue}>{props.children}</AuthContext.Provider>
};

export default AuthContext