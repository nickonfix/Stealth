import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import HomePage from "../Pages/HomePage/HomePage";
import SearchPage from "../Pages/SearchPage/SearchPage";
import CompanyPage from "../Pages/CompanyPage/CompanyPage";
import CompanyProfile from "../Components/CompanyProfile/CompanyProfile";
import IncomeStatement from "../Components/IncomeStatement/IncomeStatement";
import DesignPage from "../Pages/DesignPage/DesignPage";
import BalanceSheet from "../Components/BalanceSheet/BalanceSheet";
import CashFlowStatement from "../Components/CashFlowStatement/CashFlowStatement";
import LoginPage from "../Pages/LoginPage/LoginPage";
import RegisterPage from "../Pages/RegisterPage/RegisterPage";
import ProtectedRoutes from "./ProtectedRoutes";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <HomePage /> },
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
            { path: "search", element: <ProtectedRoutes><SearchPage /></ProtectedRoutes> },
            { path: "design-guide", element: <DesignPage /> },
            {
                path: "/company/:ticker",
                element: <ProtectedRoutes><CompanyPage /></ProtectedRoutes>,
                children: [
                    { path: "company-profile", element: <ProtectedRoutes><CompanyProfile /></ProtectedRoutes> },
                    { path: "income-statement", element: <ProtectedRoutes><IncomeStatement /></ProtectedRoutes> },
                    { path: "balance-sheet", element: <ProtectedRoutes><BalanceSheet /></ProtectedRoutes> },
                    { path: "cashflow-statement", element: <ProtectedRoutes><CashFlowStatement /></ProtectedRoutes> },
                ],
            },

        ]
    }
])