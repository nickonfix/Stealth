import axios from "axios";
import { CommentGet, CommentPost } from "../Models/Comment";
import { handleError } from "../Helper/ErrorHandler";
import { API_URL } from "../configs";

const api = API_URL + "comment/";
export const commentPostAPI = async (title: string, content: string, symbol: string, token: string) => {
    try{
        const data  = await axios.post<CommentPost>(api + `${symbol}`, {
            title: title,
            content: content,
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return data;
        
    }catch(error){
        handleError(error);
    }
}

export const commentGetAPI = async (symbol: string) => {
    try{
        const data  = await axios.get<CommentGet[]>(api + `?Symbol=${symbol}`);
        return data;
        
    }catch(error){
        handleError(error);
    }
}