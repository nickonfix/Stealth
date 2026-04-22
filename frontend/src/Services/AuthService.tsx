// import axios from "axios";
// import { handleError } from "../Helper/ErrorHandler";
// import { UserPorfileToken } from "../Models/User"
// import { API_URL } from "../configs";

// const api = API_URL;


// export const loginAPI = async (username: string, password: string)=>{
//     try{ 
//         const data = await axios.post<UserPorfileToken>(api + "account/login", {username: username, password:password,});
//         return data;
//     }catch(error){
//         handleError(error);
//     }
// }

// export const RegisterAPI = async (username: string, password: string, email: string)=>{
//     try{ 
//         const data = await axios.post<UserPorfileToken>(api + "account/register", {username: username, password:password, email:email,});
//         return data;
//     }catch(error){
//         handleError(error);
//     }
// }
   
import axios from "axios";
import { handleError } from "../Helper/ErrorHandler";
import { UserPorfileToken } from "../Models/User";
import { API_URL } from "../configs";

// Ensure 'api' is treated as the base string
const api = API_URL;

export const loginAPI = async (username: string, password: string) => {
    try { 
        // Fixed: Added "/" before account to prevent "apiaccount" concatenation
        const data = await axios.post<UserPorfileToken>(api + "/account/login", {
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
        // Fixed: Added "/" before account to prevent "apiaccount" concatenation
        const data = await axios.post<UserPorfileToken>(api + "/account/register", {
            username: username, 
            password: password, 
            email: email,
        });
        return data;
    } catch(error) {
        handleError(error);
    }
}   

    
