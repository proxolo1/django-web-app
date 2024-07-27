import { useAuthStore } from '../store/auth';
import axios from './axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

export const login = async (username, password) => {
    try {
        // TODO: Set here the the address to the login url and send username and password with the post request
        const { data, status } = await axios.post('http://127.0.0.1:8000/api/token/', {
            username: username, password: password
        });
        if (status === 200) {
            // TODO: Set here the access- and refreshtoken
            setAuthUser(data.access, data.refresh);
        }
        return { 
            data, 
            error: null ,
        };
    } catch (error) {
        if (error.response.status === 401) {
            return {
                data: null,
                error: error.response.data.detail,
            }
        } else {
            return {
                data: null,
                error: error.response.data?.detail || 'Something went wrong by login!',
            }
        };
    }
};

export const register = async (username, email, password, password2) => {
    try {
        // TODO: Set here the the adresse to the register url and send username, email, password and password2 with the post request
        const { data } = await axios.post('http://127.0.0.1:8000/api/register/', {
            username: username, email: email, password: password, password2: password2
        });
        // TODO: Login the user
        await login(username, password);
        return { 
            data, 
            error: null
        };
    } catch (error) {
        return {
            data: null,
            error: error.response.data || 'Something went wrong by register!',
        };
    }
};

export const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    useAuthStore.getState().setUser(null);
};

export const setUser = async () => {
    // On page load
    const accessToken = Cookies.get('access_token');
    const refreshToken = Cookies.get('refresh_token');
    
    if (accessToken === 'undefined' || refreshToken === 'undefined') {
        return;
    }

    if (!accessToken || !refreshToken) {
        return;
    }
    
    if (isAccessTokenExpired(accessToken)) {
        const response = await getRefreshToken(refreshToken);
        setAuthUser(response.access, response.refresh);
    } else {
        setAuthUser(accessToken, refreshToken);
    }
};

export const setAuthUser = (access_token, refresh_token) => {
    Cookies.set('access_token', access_token, {
        expires: 1,
        secure: true,
    });

    Cookies.set('refresh_token', refresh_token, {
        expires: 7,
        secure: true,
    });

    const user = jwtDecode(access_token) ?? null;

    if (user) {
        useAuthStore.getState().setUser(user);
    }
    useAuthStore.getState().setLoading(false);
};

export const getRefreshToken = async () => {
    const refresh_token = Cookies.get('refresh_token');
    const response = await axios.post('token/refresh/', {
        refresh: refresh_token,
    });
    return response.data;
};

export const isAccessTokenExpired = (accessToken) => {
    try {
        const decodedToken = jwtDecode(accessToken);
        return decodedToken.exp < Date.now() / 1000;
    } catch (error) {
        return true; // Token is invalid or expired
    }
};