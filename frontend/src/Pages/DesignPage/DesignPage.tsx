import React from 'react'
import Table from '../../Components/Table/Table'
import RatioList from '../../Components/RatioList/RatioList'
import { CompanyKeyMetrics } from '../../companyd'
import { testIncomeStatementData } from '../../Components/Table/testdata'
import IncomeStatement from '../../Components/IncomeStatement/IncomeStatement'

type Props = {}

const tableConfig = [
    {
        label: "Market Cap",
        render: (company: CompanyKeyMetrics) => company.marketCap,
    },
]
const DesignPage = (props: Props) => {
    return (
        <>

            <h1> FinArc Design Page</h1>
            <h2> This is FinArc's design page. This is where we will house various design aspects of the app
            </h2>
            <RatioList data={testIncomeStatementData} config={tableConfig} />
            <Table data={IncomeStatement} config={tableConfig} />
            <h3>
                Table - Table takes in a configuration object and company data as params. Use the config to style your table.
            </h3>

        </>
    )
}

export default DesignPage