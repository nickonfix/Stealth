import React, { useEffect, useState } from 'react'
import { CompanyIncomeStatement } from '../../companyd';
import { useOutletContext } from 'react-router';
import { getIncomeStatement } from '../../api';
import Table from '../Table/Table';
import Spinner from '../Spinner/Spinner';
import { formatLargeMonetaryNumber, formatRatio } from '../../Helper/NumberFormatting';

type Props = {}

const configs = [
    {
        label: "Date",
        render: (company: CompanyIncomeStatement) => company.date,
        subTitle: "Reporting period for the income statement",
    },
    {
        label: "Revenue",
        render: (company: CompanyIncomeStatement) =>
            formatLargeMonetaryNumber(company.revenue),
        subTitle:
            "Total income generated from business operations",
    },
    {
        label: "Cost Of Revenue",
        render: (company: CompanyIncomeStatement) =>
            formatLargeMonetaryNumber(company.costOfRevenue),
        subTitle:
            "Direct costs of producing goods or services",
    },
    {
        label: "Gross Profit",
        render: (company: CompanyIncomeStatement) =>
            formatLargeMonetaryNumber(company.grossProfit),
        subTitle:
            "Revenue minus cost of revenue",
    },
    {
        label: "Depreciation & Amortization",
        render: (company: CompanyIncomeStatement) =>
            formatLargeMonetaryNumber(
                company.depreciationAndAmortization
            ),
        subTitle:
            "Non-cash expenses reducing asset value over time",
    },
    {
        label: "Operating Income",
        render: (company: CompanyIncomeStatement) =>
            formatLargeMonetaryNumber(company.operatingIncome),
        subTitle:
            "Profit from core business operations",
    },
    {
        label: "Income Before Taxes",
        render: (company: CompanyIncomeStatement) =>
            formatLargeMonetaryNumber(company.incomeBeforeTax),
        subTitle:
            "Earnings before tax deductions",
    },
    {
        label: "Net Income",
        render: (company: CompanyIncomeStatement) =>
            formatLargeMonetaryNumber(company.netIncome),
        subTitle:
            "Final profit after all expenses",
    },
    {
        label: "EPS",
        render: (company: CompanyIncomeStatement) =>
            formatRatio(company.eps),
        subTitle:
            "Earnings per share",
    },
    {
        label: "EPS Diluted",
        render: (company: CompanyIncomeStatement) =>
            formatRatio(company.epsDiluted),
        subTitle:
            "Earnings per share including dilution",
    },
];

const IncomeStatement = (props: Props) => {
    const ticker = useOutletContext<string>();
    const [incomeStatement, setIncomeStatement] = useState<CompanyIncomeStatement[]>([]);
    useEffect(() => {
        const fetchIncomeStatement = async () => {
            const result = await getIncomeStatement(ticker);
            if (typeof result === "string") {
                console.log("Error:", result);
            } else if (result) {
                setIncomeStatement(result);
            }
        };
        fetchIncomeStatement();
    }, [ticker]);
    return (
        <div className="w-full px-4 sm:px-0">
            {incomeStatement.length > 0 ? <> <Table config={configs} data={incomeStatement} />
            </> : <> <Spinner /> </>}

        </div>
    )
}

export default IncomeStatement