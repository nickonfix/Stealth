import axios from "axios";
import { CompanyBalanceSheet, CompanyIncomeStatement, CompanyKeyMetrics, CompanyProfile, CompanySearch } from "./companyd";

interface SearchResponse {
    data: CompanySearch[];
}

export const searchCompaines = async (query: string) => {
    try {
        const data = await axios.get<SearchResponse>(
            `https://financialmodelingprep.com/stable/search-symbol?query=${query}&limit=10&apikey=${process.env.REACT_APP_API_KEY}`

        )
        return data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("Error fetching data:", error.message);
            return error.message;
        }
        else {
            console.log("Unexpected error:", error);
            return "An Unexpected error has occured";
        }
    }
}


export const getCompanyProfile = async (query: string) => {
    try {
        const data = await axios.get<CompanyProfile[]>(
            `https://financialmodelingprep.com/stable/profile?symbol=${query}&apikey=${process.env.REACT_APP_API_KEY}`
        )
        return data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("Error fetching data:", error.message);
            return error.message;
        }
        else {
            console.log("Unexpected error:", error);
            return "An Unexpected error has occured";
        }
    }
}




export const getKeyMetrics = async (query: string) => {
    try {
        const data = await axios.get<CompanyKeyMetrics[]>(
            `https://financialmodelingprep.com/stable/key-metrics-ttm?symbol=${query}&apikey=${process.env.REACT_APP_API_KEY}`
        )
        return data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("Error fetching data:", error.message);
            return error.message;
        }
        else {
            console.log("Unexpected error:", error);
            return "An Unexpected error has occured";
        }
    }
}

export const getIncomeStatement = async (query: string) => {
    try {
        const data = await axios.get<CompanyIncomeStatement[]>(
            `https://financialmodelingprep.com/stable/income-statement?symbol=${query}&limit=2&apikey=${process.env.REACT_APP_API_KEY}`
        )
        return data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("Error fetching data:", error.message);
            return error.message;
        }
        else {
            console.log("Unexpected error:", error);
            return "An Unexpected error has occured";
        }
    }
}

export const getBalanceSheet = async (query: string) => {
    try {
        const data = await axios.get<CompanyBalanceSheet[]>(
            `https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=${query}&limit=2&apikey=${process.env.REACT_APP_API_KEY}`
        )
        return data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("Error fetching data:", error.message);
            return error.message;
        }
        else {
            console.log("Unexpected error:", error);
            return "An Unexpected error has occured";
        }
    }
}