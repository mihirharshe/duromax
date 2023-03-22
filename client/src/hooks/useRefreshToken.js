import axios from 'axios';
import useAuth from './useAuth';
// import 

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('http://localhost:5124/api/v1/auth/refresh-token', { withCredentials: true });
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data);
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