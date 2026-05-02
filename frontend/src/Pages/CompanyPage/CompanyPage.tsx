import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CompanyProfile } from '../../companyd';
import { getCompanyProfile } from '../../api';
import Sidebar from '../../Components/Sidebar/Sidebar';
import CompanyDashboard from '../../Components/CompanyDashboard/CompanyDashboard';
import Tile from '../../Components/Tile/Tile';
import Spinner from '../../Components/Spinner/Spinner';

interface Props { }

const CompanyPage = (props: Props) => {
    //https:localhost:3000/company
    let { ticker } = useParams();
    const [company, setCompany] = useState<CompanyProfile>();


    useEffect(() => {
        const getProfileInit = async () => {
            const result = await getCompanyProfile(ticker!);
            if (typeof result !== "string" && result) {
                setCompany(result[0]);
            }
        }
        getProfileInit();
    }, [ticker])


    return (
        <>
            {
                company ? (
                    <div className="w-full relative flex flex-col md:flex-row ct-docs-disable-sidebar-content overflow-x-hidden bg-[#1f2228] text-white">
                        <Sidebar />
                        <CompanyDashboard ticker={ticker!}>
                            <Tile title="IDENTIFIER" subtitle={company.symbol} />
                            <Tile title="VALUATION" subtitle={"$" + company.price} />
                            <Tile title="EXCHANGE" subtitle={company.exchange} />
                            <Tile title="VERTICAL" subtitle={company.industry} />
                            
                            <div className="w-full px-4 mt-6">
                                <p className="bg-white/[0.02] text-white/60 border border-white/10 p-8 font-sans text-sm leading-relaxed text-justify">
                                    {company.description}
                                </p>
                            </div>
                        </CompanyDashboard>
                    </div>
                ) : (
                    <Spinner />
                )
            }

        </>

    )
}

export default CompanyPage