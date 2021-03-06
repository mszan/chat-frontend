import {clearAuthTokens, getAccessToken, getRefreshToken, isLoggedIn, setAuthTokens} from 'axios-jwt';
import axiosBackend, {authResponseToAuthTokens, IAuthResponse} from './axios-backend';

interface ILoginRequest {
    username: string,
    password: string
}

interface IRegisterRequest {
    username: string,
    password1: string,
    password2: string,
    email: string
}


// Login user.
const login = async (params: ILoginRequest): Promise<void> => {
    const res: IAuthResponse = (await axiosBackend.post('/token/', params)).data;
    // Save tokens to localStorage.
    setAuthTokens(authResponseToAuthTokens(res));

    // Save username to localStorage.
    localStorage.setItem('loggedUserUsername', params.username);
};

// Resets auth tokens.
const logout = (): void => {
    clearAuthTokens();
    localStorage.removeItem('loggedUserUsername');
};

// Checks if refresh token exists.
if (isLoggedIn()) {
    // Assume we are logged in because we have a refresh token.
}

// Gets access to auth tokens.
const accessToken = getAccessToken();
const refreshToken = getRefreshToken();

// Register user.
const register = async (params: IRegisterRequest): Promise<void> => {
    await axiosBackend.post('/accounts/registration/', params);
};

export {login, logout, register, accessToken, refreshToken};