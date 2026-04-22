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

    const [dark, setDark] = useState<boolean>(() =>
        typeof window !== "undefined"
            ? localStorage.getItem("finarc-theme") === "dark" ||
              document.documentElement.classList.contains("dark")
            : false
    );

    useEffect(() => {
        const handler = (e: Event) => setDark((e as CustomEvent).detail.dark);
        window.addEventListener("finarc-theme-change", handler);
        return () => window.removeEventListener("finarc-theme-change", handler);
    }, []);

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
                    <div className="w-full relative flex ct-docs-disable-sidebar-content overflow-x-hidden bg-gray-50 text-gray-900 dark:bg-[#070b0f] dark:text-gray-100 transition-colors duration-300">
                        <Sidebar />
                        <CompanyDashboard ticker={ticker!}>
                            <Tile title="Company Name" subtitle={company.companyName} />
                            <Tile title="Price" subtitle={"$" + company.price} />
                            <Tile title="Exchange" subtitle={company.exchange} />
                            <Tile title="Industry" subtitle={company.industry} />
                            {/* <Tile title="Sector" subtitle={company.sector} /> */}
                            <p className="bg-white text-gray-900 shadow rounded text-medium p-3 mt-1 m-4 text-justify text-justify-inter-word dark:bg-[#0f172a] dark:text-gray-300 dark:border dark:border-gray-800">
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