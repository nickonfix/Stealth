import axios from "axios";
import { handleError } from "../Helper/ErrorHandler";
import { UserPorfileToken } from "../Models/User"

const api = "http://localhost:5249/api/";


export const loginAPI = async (username: string, password: string)=>{
    try{ 
        const data = await axios.post<UserPorfileToken>(api + "account/login", {username: username, password:password,});
        return data;
    }catch(error){
        handleError(error);
    }
}

export const RegisterAPI = async (username: string, password: string, email: string)=>{
    try{ 
        const data = await axios.post<UserPorfileToken>(api + "account/register", {username: username, password:password, email:email,});
        return data;
    }catch(error){
        handleError(error);
    }
}
   
    

    
