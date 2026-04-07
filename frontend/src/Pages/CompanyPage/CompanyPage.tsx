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
    }, [])


    return (
        <>
            {
                company ? (
                    <div className="w-full relative flex ct-docs-disable-sidebar-content overflow-x-hidden">

                        <Sidebar />
                        <CompanyDashboard ticker={ticker!}>
                            <Tile title="Company Name" subtitle={company.companyName} />
                            <Tile title="Price" subtitle={"$" + company.price} />
                            <Tile title="Exchange" subtitle={company.exchange} />
                            <Tile title="Industry" subtitle={company.industry} />
                            {/* <Tile title="Sector" subtitle={company.sector} /> */}
                            <p className="bg-white shadow rounded text-medium text gray-900 p-3 mt-1 m-4 text-justify text-justify-inter-word">{company.description}
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