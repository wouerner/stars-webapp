import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: headers()
});

function headers () {
    const token = localStorage.getItem('token');

    return {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
}

export const setupInterceptors = (onUnauthorized) => {
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                if (onUnauthorized) {
                    onUnauthorized();
                }
            }
            return Promise.reject(error);
        }
    );
};

export default instance;
