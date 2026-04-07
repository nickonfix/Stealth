import React, { useEffect, useState } from 'react'
import { CompanyKeyMetrics } from '../../companyd';
import { useOutletContext } from 'react-router-dom';
import { getKeyMetrics } from '../../api';
import RatioList from '../RatioList/RatioList';

type Props = {}



const tableConfig = [
    {
        label: "Market Cap",
        render: (company: CompanyKeyMetrics) => company.marketCap,
    },
    {
        label: "Current Ratio",
        render: (company: CompanyKeyMetrics) => company.currentRatioTTM,
    },
    {
        label: "Return On Equity",
        render: (company: CompanyKeyMetrics) => company.returnOnEquityTTM,
    },
    {
        label: "Net Current Asset Value",
        render: (company: CompanyKeyMetrics) => company.netCurrentAssetValueTTM,
    },
    {
        label: "Cash Flow",
        render: (company: CompanyKeyMetrics) => company.evToFreeCashFlowTTM,
    },
    {
        label: "Return On Assets",
        render: (company: CompanyKeyMetrics) => company.returnOnAssetsTTM,
    },
];


const CompanyProfile = (props: Props) => {
    const ticker = useOutletContext<string>();
    const [companyData, setcompanyData] = useState<CompanyKeyMetrics>();
    useEffect(() => {
        const getCompanyKeyMetrics = async () => {
            const value = await getKeyMetrics(ticker);
            //setcompanyData(value?.data[0]);
            setcompanyData(Array.isArray(value) ? value[0] : undefined);
        }
        getCompanyKeyMetrics();
    }, [ticker])


    return (
        <>{companyData ? (
            <>
                <RatioList config={tableConfig} data={companyData} />
            </>
        ) : (
            <p>Loading...</p>
        )}
        </>
    )
}

export default CompanyProfile
