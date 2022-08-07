import React, { useState, useEffect, useCallback } from 'react';

let logoutTimer;

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: token => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  //console.log("expirationTime", expirationTime) //"Fri Aug 05 2022 18:58:05" // на час больше
  const currentTime = new Date().getTime(); //in ms
  const adjExpirationTime = new Date(expirationTime).getTime();
  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

//***
const retrievedStoredTokens = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationTime = localStorage.getItem('expirationTime');
  const remainingTime = calculateRemainingTime(storedExpirationTime);

  if (remainingTime <= 60000) {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  //console.log("beforeProvider", localStorage.getItem("token"))

  const tokenData = retrievedStoredTokens(); ////**** returned object {token: storedToken,duration:remainingTime}
  //const initialToken = localStorage.getItem("token");
  let initialToken;
  if (tokenData) {initialToken = tokenData.token;}

  const [token, setIsToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setIsToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');

    //**
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  });

  const loginHandler = (token, expirationTime) => {
    //console.log("expirationTime",expirationTime) ~ на час больше
    setIsToken(token); //console.log("token", token) ~ eyJhbGciOiJSUzI1NiIsImtpZCI6IjA2M2E3Y2E0M2MzYzc2MDM2NzRlZGE0YmU5NzcyNWI3M2QwZGMwMWYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcmVhY3QtaHR0cC01MzE1OSIsImF1ZCI6InJlYWN0LWh0dHAtNTMxNTkiLCJhdXRoX3RpbWUiOjE2NTk2NDc0MDgsInVzZXJfaWQiOiJxbFhudnczQ0VWZm5Delk3RE1vZGVBYXlvT0QyIiwic3ViIjoicWxYbnZ3M0NFVmZuQ3pZN0RNb2RlQWF5b09EMiIsImlhdCI6MTY1OTY0NzQwOCwiZXhwIjoxNjU5NjUxMDA4LCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEB0ZXN0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.c_5fGoafjf9Vcm5TZ_Gk74LrxsEDeWoiWeotFYwKDNRgWNUS5qcGuhsRg8Y1qL68oOhBj7WnHXcNZnyuBciqhxWRcpx3QzARK0dhpNppy18yYbmfcVBvHyppjCgpvWv1yny_9fgmoDPPqfvkah3XJXStNf6c_afI-w8_Eu2tjHkkdLvrHkIrDqBDGYPMxYqrJ_HsvUkEexzgm4ZHPtnEp158gXWEfNIVmhiaclqU6IWjplS19jXHiNyfSrV23BHTb47NIFsmXTHSl7sBTl-gunhLnafkzWxSi7lmJd4CA4EoLZS0w9W9veIkCRCx9u1pzz2EHS4WieRH7jjuDVhhIg

    localStorage.setItem('token', token);
    localStorage.setItem('expirationTime', expirationTime);

    const remainingTime = calculateRemainingTime(expirationTime); //console.log("remainingTime",remainingTime) ~ 3600000;
    logoutTimer = setTimeout(logoutHandler, remainingTime); //*
  };

  //*****
  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration); //менее 1 часа ~ 3569005
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};


export default AuthContext;
