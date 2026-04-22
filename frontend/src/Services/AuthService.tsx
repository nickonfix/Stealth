import axios from "axios";
import { handleError } from "../Helper/ErrorHandler";
import { UserPorfileToken } from "../Models/User";
import { API_URL } from "../configs";

// The "api" variable from your config
const api = API_URL;

export const loginAPI = async (username: string, password: string) => {
    try { 
        // We use a template literal to force the slash between the base and the route
        const data = await axios.post<UserPorfileToken>(`${api}/account/login`, {
            username: username, 
            password: password,
        });
        return data;
    } catch(error) {
        handleError(error);
    }
}

export const RegisterAPI = async (username: string, password: string, email: string) => {
    try { 
        // We use a template literal to force the slash here too
        const data = await axios.post<UserPorfileToken>(`${api}/account/register`, {
            username: username, 
            password: password, 
            email: email,
        });
        return data;
    } catch(error) {
        handleError(error);
    }
}