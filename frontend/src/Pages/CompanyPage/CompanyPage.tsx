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
                    <div className="w-full relative flex flex-col md:flex-row ct-docs-disable-sidebar-content overflow-x-hidden bg-gray-100 text-gray-900 dark:bg-black dark:text-zinc-100 transition-colors duration-300">
                        <Sidebar />
                        <CompanyDashboard ticker={ticker!}>
                            <Tile title="Company Name" subtitle={company.companyName} />
                            <Tile title="Price" subtitle={"$" + company.price} />
                            <Tile title="Exchange" subtitle={company.exchange} />
                            <Tile title="Industry" subtitle={company.industry} />
                            {/* <Tile title="Sector" subtitle={company.sector} /> */}
                            <p className="bg-white text-gray-900 shadow rounded text-medium p-3 mt-1 m-4 text-justify text-justify-inter-word dark:bg-zinc-900/50 dark:text-zinc-300 dark:border dark:border-zinc-800 transition-colors duration-300">
                                {company.description}
                            </p>
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