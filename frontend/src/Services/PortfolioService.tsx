import axios from "axios";
import { PortfolioGet, portfolioPost } from "../Models/Portfolio";
import { handleError } from "../Helper/ErrorHandler";
import { API_URL } from "../configs";

const api = API_URL + "portfolio/"
const PORTFOLIO_CACHE_KEY = "finarc_portfolio_cache_v1";
const PORTFOLIO_CACHE_TTL_MS = 30 * 1000;

type PortfolioCachePayload = {
    ts: number;
    data: PortfolioGet[];
};

const readPortfolioCache = (): PortfolioGet[] | null => {
    try {
        const raw = localStorage.getItem(PORTFOLIO_CACHE_KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw) as PortfolioCachePayload;
        if (!Array.isArray(parsed.data) || typeof parsed.ts !== "number") return null;
        if (Date.now() - parsed.ts > PORTFOLIO_CACHE_TTL_MS) return null;

        return parsed.data;
    } catch {
        return null;
    }
};

const writePortfolioCache = (data: PortfolioGet[]) => {
    try {
        const payload: PortfolioCachePayload = { ts: Date.now(), data };
        localStorage.setItem(PORTFOLIO_CACHE_KEY, JSON.stringify(payload));
    } catch {
        // ignore cache write failures
    }
};

export const clearPortfolioCache = () => {
    try {
        localStorage.removeItem(PORTFOLIO_CACHE_KEY);
    } catch {
        // ignore cache clear failures
    }
};

export const portfolioAddAPI = async (symbol: string) => {
    try{
        const data = await axios.post<portfolioPost>(api + `?Symbol=${symbol}`);
        clearPortfolioCache();
        return data;
    }catch(error){
        handleError(error);
    }
}


export const portfolioDeleteAPI = async (symbol: string) => {
    try{
        const data = await axios.delete<portfolioPost>(api + `?symbol=${symbol}`);
        clearPortfolioCache();
        return data;
    }catch(error){
        handleError(error);
    }
}

export const portfolioGetAPI = async () => {
    try{
        const cachedData = readPortfolioCache();
        if (cachedData) {
            return { data: cachedData, status: 200 } as const;
        }

        const data = await axios.get<PortfolioGet[]>(api);
        if (data?.data) {
            writePortfolioCache(data.data);
        }
        return data;
    }catch(error){
        handleError(error);
    }
}