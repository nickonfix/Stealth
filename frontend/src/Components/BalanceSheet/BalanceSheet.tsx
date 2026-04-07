import React, { useEffect, useState } from "react";
import { CompanyBalanceSheet } from "../../companyd";
import { useOutletContext } from "react-router-dom";
import RatioList from "../RatioList/RatioList";
import { getBalanceSheet } from "../../api";
import Table from "../Table/Table";
import Spinner from "../Spinner/Spinner";
import { formatLargeMonetaryNumber } from "../../Helper/NumberFormatting";


type Props = {};


const config = [
    {
        label: <div className="font-bold">Total Assets</div>,
        render: (company: CompanyBalanceSheet) =>
            formatLargeMonetaryNumber(company.totalAssets),
        subTitle: "Total value of everything the company owns",
    },
    {
        label: "Current Assets",
        render: (company: CompanyBalanceSheet) =>
            formatLargeMonetaryNumber(company.totalCurrentAssets),
        subTitle:
            "Assets expected to be converted into cash within a year",
    },
    {
        label: "Total Cash",
        render: (company: CompanyBalanceSheet) =>
            formatLargeMonetaryNumber(company.cashAndCashEquivalents),
        subTitle: "Cash and liquid assets available immediately",
    },
    {
        label: "Property & Equipment",
        render: (company: CompanyBalanceSheet) =>
            formatLargeMonetaryNumber(company.propertyPlantEquipmentNet),
        subTitle:
            "Physical assets like buildings, machinery, and equipment",
    },
    {
        label: "Intangible Assets",
        render: (company: CompanyBalanceSheet) =>
            formatLargeMonetaryNumber(company.intangibleAssets),
        subTitle:
            "Non-physical assets like patents, trademarks, and goodwill",
    },
    {
        label: "Long Term Debt",
        render: (company: CompanyBalanceSheet) =>
            formatLargeMonetaryNumber(company.longTermDebt),
        subTitle:
            "Debt obligations due after more than one year",
    },
    {
        label: "Total Debt",
        render: (company: CompanyBalanceSheet) =>
            formatLargeMonetaryNumber(
                company.longTermDebt + company.totalCurrentLiabilities
            ),
        subTitle:
            "Total of short-term and long-term debt obligations",
    },

    {
        label: <div className="font-bold">Total Liabilities</div>,
        render: (company: CompanyBalanceSheet) =>
            formatLargeMonetaryNumber(company.totalLiabilities),
        subTitle:
            "Total obligations the company owes to others",
    },
    {
        label: "Current Liabilities",
        render: (company: CompanyBalanceSheet) =>
            formatLargeMonetaryNumber(company.totalCurrentLiabilities),
        subTitle:
            "Liabilities due within one year",
    },
    {
        label: "Long-Term Liabilities",
        render: (company: CompanyBalanceSheet) =>
            formatLargeMonetaryNumber(company.otherLiabilities),
        subTitle:
            "Obligations due beyond one year (excluding long-term debt)",
    },
    {
        label: "Shareholder's Equity",
        render: (company: CompanyBalanceSheet) =>
            formatLargeMonetaryNumber(company.totalStockholdersEquity),
        subTitle:
            "Net value belonging to shareholders after liabilities",
    },
    {
        label: "Retained Earnings",
        render: (company: CompanyBalanceSheet) =>
            formatLargeMonetaryNumber(company.retainedEarnings),
        subTitle:
            "Accumulated profits reinvested into the business",
    },
];

const BalanceSheet = (props: Props) => {
    const ticker = useOutletContext<string>();
    const [balanceSheet, setBalanceSheet] = useState<CompanyBalanceSheet>();
    useEffect(() => {
        const fetchBalanceSheet = async () => {
            const result = await getBalanceSheet(ticker);
            if (typeof result === "string") {
                console.log("Error:", result);
            } else if (result && result.length > 0) {
                setBalanceSheet(result[0]);
            }
        };
        fetchBalanceSheet();
    }, [ticker]);
    return (
        <>
            {balanceSheet ? (
                <RatioList config={config} data={balanceSheet} />
            ) : (
                <Spinner />
            )}
        </>
    );
};

export default BalanceSheet;