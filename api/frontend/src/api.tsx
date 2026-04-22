import axios from "axios";
import { CompanyBalanceSheet, CompanyCashFlow, CompanyIncomeStatement, CompanyKeyMetrics, CompanyProfile, CompanySearch } from "./companyd";

const rawBackendUrl = process.env.REACT_APP_BACKEND_URL || "https://localhost:5246";
const normalizedBackendUrl = rawBackendUrl.replace(/\/+$/, "");
const apiBaseUrl = normalizedBackendUrl.endsWith("/api")
    ? normalizedBackendUrl
    : `${normalizedBackendUrl}/api`;

export const searchCompaines = async (query: string) => {
    try {
        const data = await axios.get<CompanySearch[]>(
            `${apiBaseUrl}/fmp/search-symbol?query=${encodeURIComponent(query)}&limit=10`
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
            `${apiBaseUrl}/fmp/profile/${encodeURIComponent(query)}`
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
            `${apiBaseUrl}/fmp/key-metrics/${encodeURIComponent(query)}`
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
            `${apiBaseUrl}/fmp/income-statement/${encodeURIComponent(query)}?limit=2`
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
            `${apiBaseUrl}/fmp/balance-sheet/${encodeURIComponent(query)}?limit=2`
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

export const getCashFlowStatement = async (query: string) => {
    try {
        const data = await axios.get<CompanyCashFlow[]>(
            `${apiBaseUrl}/fmp/cash-flow/${encodeURIComponent(query)}?limit=2`
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