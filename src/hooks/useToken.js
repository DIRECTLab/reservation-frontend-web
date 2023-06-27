import { useState } from "react";
import jwt_decode from 'jwt-decode'
import moment from 'moment'


function decodeJwt(token) {
  const decoded = jwt_decode(token);
  return decoded;
}

const useToken = () => {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString)
    if (userToken) {
      const decodedToken = decodeJwt(userToken)
      // Check if the jwt token is expired
      // Get current time
      let currentTime = (new Date().getTime() / 1000).toFixed(0)
      if (currentTime > decodedToken.exp) {
        localStorage.setItem('token', null)
      }
      else {
        return decodedToken
      }
    }
    else {
      return userToken
    }

  }

  const getEncodedToken = () => {
    const tokenString = localStorage.getItem('token');
    return tokenString;
  }

  const [token, setToken] = useState(getToken());
  const [tokenEncoded, setTokenEncoded] = useState(getEncodedToken());


  const saveToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken))
    setTokenEncoded(userToken);
    setToken(getToken())
  }
  
  return {
    setToken: saveToken,
    token,
    tokenEncoded,
  }
}
export default useToken