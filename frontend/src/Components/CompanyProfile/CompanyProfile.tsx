import React, { useEffect, useState } from 'react'
import { CompanyKeyMetrics } from '../../companyd';
import { useOutletContext } from 'react-router-dom';
import { getKeyMetrics } from '../../api';
import RatioList from '../RatioList/RatioList';
import { formatLargeNonMonetaryNumber, formatRatio } from '../../Helper/NumberFormatting';
import Spinner from '../Spinner/Spinner';
import StockComment from '../StockComment/StockComment';

type Props = {}
const tableConfig = [
    {
        label: "Market Cap",
        render: (company: CompanyKeyMetrics) =>
            formatLargeNonMonetaryNumber(company.marketCap),
        subTitle: "Total value of all a company's shares of stock",
    },
    {
        label: "Current Ratio",
        render: (company: CompanyKeyMetrics) =>
            formatRatio(company.currentRatioTTM),
        subTitle:
            "Measures the company's ability to pay short-term debt obligations",
    },
    {
        label: "Return On Equity",
        render: (company: CompanyKeyMetrics) =>
            formatRatio(company.returnOnEquityTTM),
        subTitle:
            "Net income divided by shareholder's equity, showing profitability",
    },
    {
        label: "Net Current Asset Value",
        render: (company: CompanyKeyMetrics) =>
            formatLargeNonMonetaryNumber(company.netCurrentAssetValueTTM),
        subTitle:
            "Represents a company's liquidity (current assets minus liabilities)",
    },
    {
        label: "Cash Flow (EV/FCF)",
        render: (company: CompanyKeyMetrics) =>
            formatRatio(company.evToFreeCashFlowTTM),
        subTitle:
            "Shows how expensive a company is relative to its free cash flow",
    },
    {
        label: "Return On Assets",
        render: (company: CompanyKeyMetrics) =>
            formatRatio(company.returnOnAssetsTTM),
        subTitle:
            "Measures how efficiently a company uses its assets to generate profit",
    },
];
const CompanyProfile = (props: Props) => {
    const ticker = useOutletContext<string>();
    const [companyData, setcompanyData] = useState<CompanyKeyMetrics>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getCompanyKeyMetrics = async () => {
            const value = await getKeyMetrics(ticker);
            if (typeof value !== "string" && Array.isArray(value) && value.length > 0) {
                setcompanyData(value[0]);
                setError(null);
            } else {
                setError("No data available.");
            }
        }
        getCompanyKeyMetrics();
    }, [ticker])

    return (
        <>
            {error ? (
                <div className="w-full text-center mt-10 text-white"><h2>{error}</h2></div>
            ) : companyData ? (
                <>
                    <RatioList config={tableConfig} data={companyData} />
                    <StockComment stockSymbol =  {ticker}/>
                </>
            ) : (
                <Spinner />
            )}
        </>
    )
}

export default CompanyProfile
