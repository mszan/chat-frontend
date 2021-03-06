import axios from 'axios';
import {IAuthTokens, TokenRefreshRequest, useAuthTokenInterceptor as authTokenInterceptor} from 'axios-jwt';

// Axios instance dedicated for backend API.
const axiosBackend = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_API_URL
});

// Type of response from login endpoint.
export interface IAuthResponse {
    access: string
    refresh: string
}

// Refresh token endpoint.
const refreshEndpoint = `${axiosBackend.defaults.baseURL}/token/refresh/`;

// Transform response into IAuthTokens.
// This assumes your auth endpoint returns `{"access_token": ..., "refresh_token": ...}`.
export const authResponseToAuthTokens = (res: IAuthResponse): IAuthTokens => ({
    accessToken: res.access,
    refreshToken: res.refresh,
});

// Define token refresh function.
const requestRefresh: TokenRefreshRequest = async (refreshToken: string): Promise<string> => {
    // Perform refresh.
    return (await axios.post(refreshEndpoint, { refresh: refreshToken })).data.access;
};

// Add interceptor to your axios instance.
authTokenInterceptor(axiosBackend, { requestRefresh });

// Add content-type header because DRF API requires it to be specified.
axiosBackend.defaults.headers.post['content-type'] = 'application/json';

export default axiosBackend;