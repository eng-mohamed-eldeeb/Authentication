import React, { useEffect, useState, useCallback } from 'react';
let logoutTimer;


const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {}
});

const retriveStoredToken = () => {
    const storedToken = localStorage.getItem('token')
    const storageExpirationDate = localStorage.getItem('expirationTime');

    const remainingTime = calcRemainingTime(storageExpirationDate)

    if(remainingTime <= 36000) {
        localStorage.removeItem('token')
        localStorage.removeItem('expirationTime')

        return null;
    }
    return {
        token:storedToken,
        duration: remainingTime
    }
}

const calcRemainingTime = (exTime) => {
    const currentTime = new Date().getTime();
    const adjExpirationTime= new Date(exTime).getTime();

    const remainingDuration = adjExpirationTime - currentTime;
    return remainingDuration
}


export const AuthConetextProvider = (props) => {
    const tokenData = retriveStoredToken();

    let initialToken

    if (tokenData) {
        initialToken = tokenData.token
    }
    const [token, setToken] = useState(initialToken)

    const logoutHandler = useCallback(() => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        clearTimeout(logoutTimer);
    },[]);
    
    const loginHandler = (token, expirationTime) => {
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('expirationTime', expirationTime);
        const remainingTime = calcRemainingTime(expirationTime);
    
        logoutTimer =  setTimeout(logoutHandler, remainingTime);
    };


    useEffect(() => {
        if(tokenData) {
            console.log(tokenData.duration)
            logoutTimer =  setTimeout(logoutHandler, tokenData.duration);
        }
    }, [tokenData, logoutHandler]);


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