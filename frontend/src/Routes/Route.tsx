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
import MarketsPage from "../Pages/MarketsPage/MarketsPage";
import PortfolioPage from "../Pages/PortfolioPage/PortfolioPage";
import PlaceholderPage from "../Pages/PlaceholderPage/PlaceholderPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <HomePage /> },
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
            { path: "search", element: <ProtectedRoutes><SearchPage /></ProtectedRoutes> },
            { path: "markets", element: <MarketsPage /> },
            { path: "news", element: <MarketsPage /> },
            { path: "portfolio", element: <ProtectedRoutes><PortfolioPage /></ProtectedRoutes> },
            { path: "screener", element: <PlaceholderPage title="Stock Screener" subtitle="Filter and discover stocks using custom criteria, fundamentals, and technical indicators." icon="🔍" /> },
            { path: "profile", element: <ProtectedRoutes><PlaceholderPage title="Your Profile" subtitle="Manage your account details, preferences, and investment profile." icon="👤" /></ProtectedRoutes> },
            { path: "settings", element: <ProtectedRoutes><PlaceholderPage title="Settings" subtitle="Customize your FinEdge experience — notifications, themes, and more." icon="⚙️" /></ProtectedRoutes> },
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