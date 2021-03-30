import {clearAuthTokens, getAccessToken, getRefreshToken, isLoggedIn, setAuthTokens} from 'axios-jwt';
import axiosBackend, {authResponseToAuthTokens, IAuthResponse} from './axios-backend';

interface ILoginRequest {
    username: string,
    password: string
}


// Login user.
const login = async (params: ILoginRequest) => {
    const res: IAuthResponse = (await axiosBackend.post('/token/', params)).data
    // Save tokens to localStorage.
    setAuthTokens(authResponseToAuthTokens(res))
}

// Resets auth tokens.
const logout = () => clearAuthTokens()

// Checks if refresh token exists.
if (isLoggedIn()) {
    // Assume we are logged in because we have a refresh token.
}

// Gets access to auth tokens.
const accessToken = getAccessToken()
const refreshToken = getRefreshToken()

export {login, logout, accessToken, refreshToken};