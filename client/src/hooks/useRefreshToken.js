import axios from 'axios';
import useAuth from './useAuth';
// import 

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const baseUrl = process.env.REACT_APP_API_URL;

    const refresh = async () => {
        const response = await axios.get(`${baseUrl}/api/v1/auth/refresh-token`, { withCredentials: true });
        setAuth(prev => {
            return { 
                ...prev, 
                user: response.data.user,
                roles: response.data.roles
            }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;