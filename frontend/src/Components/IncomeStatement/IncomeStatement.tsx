import React, { useEffect, useState } from 'react'
import { CompanyIncomeStatement } from '../../companyd';
import { useOutletContext } from 'react-router';
import { getIncomeStatement } from '../../api';
import Table from '../Table/Table';

type Props = {}

const configs = [
    {
        label: "Date",
        render: (company: CompanyIncomeStatement) => company.date,
    },
    {
        label: "Revenue",
        render: (company: CompanyIncomeStatement) => company.revenue,
    },
    {
        label: "Cost Of Revenue",
        render: (company: CompanyIncomeStatement) => company.costOfRevenue,
    },
    {
        label: "Gross Profit",
        render: (company: CompanyIncomeStatement) => company.grossProfit,
    },
    {
        label: "Depreciation",
        render: (company: CompanyIncomeStatement) =>
            company.depreciationAndAmortization,
    },
    {
        label: "Operating Income",
        render: (company: CompanyIncomeStatement) => company.operatingIncome,
    },
    {
        label: "Income Before Taxes",
        render: (company: CompanyIncomeStatement) => company.incomeBeforeTax,
    },
    {
        label: "Net Income",
        render: (company: CompanyIncomeStatement) => company.netIncome,
    },
    {
        label: "EPS",
        render: (company: CompanyIncomeStatement) => company.eps,
    },
    {
        label: "EPS Diluted",
        render: (company: CompanyIncomeStatement) => company.epsDiluted,
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
        <div>
            {incomeStatement.length > 0 ? <> <Table config={configs} data={incomeStatement} />
            </> : <> Loading...</>}

        </div>
    )
}

export default IncomeStatement