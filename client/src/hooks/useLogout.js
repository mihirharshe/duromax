// import axios from 'axios';
import { axiosPrivate } from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
    const { setAuth } = useAuth();

    const logout = async () => {
        setAuth({});
        try {
            const response = await axiosPrivate.post('http://localhost:5124/api/v1/auth/logout');
        } catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogout