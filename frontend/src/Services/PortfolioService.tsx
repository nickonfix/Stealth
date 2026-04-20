import axios from "axios";
import { PortfolioGet, portfolioPost } from "../Models/Portfolio";
import { handleError } from "../Helper/ErrorHandler";

const api = "http://localhost:5249/api/portfolio/"

export const portfolioAddAPI = async (symbol: string) => {
    try{
        const data = await axios.post<portfolioPost>(api + `?Symbol=${symbol}`);
        return data;
    }catch(error){
        handleError(error);
    }
}


export const portfolioDeleteAPI = async (symbol: string) => {
    try{
        const data = await axios.delete<portfolioPost>(api + `${symbol}`);
        return data;
    }catch(error){
        handleError(error);
    }
}

export const portfolioGetAPI = async () => {
    try{
        const data = await axios.get<PortfolioGet[]>(api);
        return data;
    }catch(error){
        handleError(error);
    }
}