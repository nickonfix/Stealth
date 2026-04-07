import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { CompanyCashFlow } from "../../companyd";
import { getCashFlowStatement } from "../../api";
import Table from "../Table/Table";
import Spinner from "../Spinner/Spinner";
import { formatLargeMonetaryNumber } from "../../Helper/NumberFormatting";
//import Spinner from "../Spinners/Spinner";

type Props = {};


const config = [
    {
        label: "Date",
        render: (company: CompanyCashFlow) => company.date,
        subTitle: "Reporting period for the cash flow statement",
    },
    {
        label: "Operating Cash Flow",
        render: (company: CompanyCashFlow) =>
            formatLargeMonetaryNumber(company.operatingCashFlow),
        subTitle:
            "Cash generated from core business operations",
    },
    {
        label: "Investing Cash Flow",
        render: (company: CompanyCashFlow) =>
            formatLargeMonetaryNumber(
                company.netCashUsedForInvestingActivites
            ),
        subTitle:
            "Cash used for investments like assets or acquisitions",
    },
    {
        label: "Financing Cash Flow",
        render: (company: CompanyCashFlow) =>
            formatLargeMonetaryNumber(
                company.netCashUsedProvidedByFinancingActivities
            ),
        subTitle:
            "Cash from or paid to investors and creditors",
    },
    {
        label: "Cash At End of Period",
        render: (company: CompanyCashFlow) =>
            formatLargeMonetaryNumber(company.cashAtEndOfPeriod),
        subTitle:
            "Total cash remaining at the end of the reporting period",
    },
    {
        label: "Capital Expenditure (CapEx)",
        render: (company: CompanyCashFlow) =>
            formatLargeMonetaryNumber(company.capitalExpenditure),
        subTitle:
            "Money spent on acquiring or maintaining physical assets",
    },
    {
        label: "Issuance Of Stock",
        render: (company: CompanyCashFlow) =>
            formatLargeMonetaryNumber(company.commonStockIssued),
        subTitle:
            "Cash raised by issuing new shares",
    },
    {
        label: "Free Cash Flow",
        render: (company: CompanyCashFlow) =>
            formatLargeMonetaryNumber(company.freeCashFlow),
        subTitle:
            "Cash available after capital expenditures (key profitability metric)",
    },
];

const CashFlowStatement = (props: Props) => {
    const ticker = useOutletContext<string>();
    const [cashFlowData, setCashFlowData] = useState<CompanyCashFlow[]>();
    useEffect(() => {
        const fetchCashFlow = async () => {
            const result = await getCashFlowStatement(ticker);
            if (typeof result === "string") {
                console.log(result);
            } else {
                setCashFlowData(result);
            }
        };
        fetchCashFlow();
    }, [ticker]);
    return cashFlowData ? (
        <Table config={config} data={cashFlowData}></Table>
    ) : (
        <Spinner />
    );
};

export default CashFlowStatement;